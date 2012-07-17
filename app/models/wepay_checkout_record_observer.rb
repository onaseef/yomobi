class WepayCheckoutRecordObserver < ActiveRecord::Observer
  include WepayRails::Payments

  def after_update(wcr)
    return if WepayCheckoutRecordObserver.disabled
    WepayCheckoutRecordObserver.after_update(wcr)
  end

  def self.after_update(wcr)
    return if wcr.state == 'expired'
    # puts "UPDATING WEPAY RECORD #{wcr.id}: #{wcr.state} #{wcr.reference_id}"

    payment = Payment.find_by_wepay_checkout_record_id(wcr.id)
    payment ||= Payment.new :wepay_checkout_record => wcr

    if payment.user_id.nil? || payment.company_id.nil?
      user_id, company_id, recur_type = wcr.reference_id.split('|').map(&:to_i)
      payment.user_id = user_id
      payment.company_id = company_id
    end

    if wcr.state == 'authorized' || wcr.state == 'approved'
      user_id, company_id, recur_type = wcr.reference_id.split('|').map(&:to_i)
      company = Company.find_by_id(company_id)
      return if company.nil?

      last_sub = company.last_subscription(payment)
      last_payment = company.last_payment

      # base_date is when the subscription will start
      if last_sub
        base_date = last_sub.next_charge_date(Date.today)
      elsif last_payment
        base_date = last_payment.expire_date
      end
      base_date ||= Date.today
      base_date = [company.manual_expire_date, base_date].max if company.manual_expire_date

      payment.sub_state = 'active' if wcr.period

      # !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      # NOTE: Make sure the value for time_paid matches the value for
      # checkout_params[:end_time] in site_manager_controller.rb
      # Subscription is always 5 years long (60 months)
      # !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      time_paid = 12 * 5

      payment.currency = wcr.currency
      payment.amount_paid = wcr.amount.to_s('F')
      payment.company.update_attribute :premium, true
      payment.expire_date = base_date + time_paid.months
      # puts "EXPRIE #{payment.expire_date}"

      # cancel previous subscription
      # puts "PREVIOUS SUBSCRIPTION #{last_sub && last_sub.id}"
      cancel_preapproval last_sub.wcr.preapproval_id if last_sub.present?
    end

    case wcr.state
    when /^(authorized|reserved|captured|settled)$/ then payment.is_valid = true
    when /^(failed|refunded|chargeback)$/ then
      payment.is_valid = false
      UserMailer.notify_bad_payment(payment, wcr.state).deliver
    when /^(stopped)$/ then
      # Only preapprovals have a `stopped` state
      if payment.sub_state == 'active'
        # puts "FAILED SUBSCRIPTION PAYMENT #{wcr.preapproval_id}"
        payment.expire_date = payment.next_charge_date
        payment.sub_state = 'stopped'
        UserMailer.notify_subscription_payment_failure(payment).deliver
        # check for a previous valid payment
      end
    when /^(cancelled|revoked)$/ then
      # Manually cancelled. Update expire date
      if payment.sub_state == 'active' && payment.start_date > Date.today
        # puts "KILLING #{wcr.preapproval_id}::#{payment.start_date}"
        # No payment has been made for this subscription. Just mark it as invalid
        payment.is_valid = false
        payment.sub_state = 'cancelled'
      elsif payment.sub_state == 'active'
        puts "CANCELLING #{wcr.preapproval_id}"
        payment.expire_date = payment.next_charge_date
        payment.sub_state = 'cancelled'
      end
    end
    payment.save
    payment.company.recalculate_premium
    payment
  end

  cattr_accessor(:disabled)
end
