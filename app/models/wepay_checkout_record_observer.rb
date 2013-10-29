class WepayCheckoutRecordObserver < ActiveRecord::Observer

  cattr_accessor(:disabled)

  class << self
    include WepayRails::Payments
  end

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

      payment.sub_state = 'active' if wcr.period

      payment.currency = wcr.currency
      payment.amount_paid = wcr.amount.to_s('F')
      payment.company.update_attribute :premium, true
      payment.expire_date = Time.at(wcr.end_time).to_date

      # cancel previous subscription
      cancel_preapproval last_sub.wcr.preapproval_id if last_sub.present?
    end

    case wcr.state
    when /^(authorized|reserved)$/ then payment.is_valid = true
    when /^(captured|settled)$/ then payment.last_payment_received_at = Date.current
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
      if payment.sub_state == 'active' && payment.start_date > Date.current
        # No payment has been made for this subscription. Just mark it as invalid
        payment.is_valid = false
        payment.sub_state = 'cancelled'
      elsif payment.sub_state == 'active'
        # Only mark as invalid if a payment has not been received
        payment.is_valid = false if payment.last_payment_received_at.nil?
        payment.expire_date = payment.next_charge_date
        payment.sub_state = 'cancelled'
      end
    end
    payment.save
    payment.company.recalculate_premium
    payment
  end

end
