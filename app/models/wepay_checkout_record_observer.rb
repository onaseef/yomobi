class WepayCheckoutRecordObserver < ActiveRecord::Observer
  include WepayRails::Payments

  def after_update(wcr)
    return if wcr.state == 'expired'
    puts "UPDATING WEPAY RECORD #{wcr.id}: #{wcr.state} #{wcr.reference_id}"

    payment = Payment.find_or_create_by_wepay_checkout_record_id(wcr.id)

    if payment.user_id.nil? || payment.company_id.nil?
      user_id, company_id, months = wcr.reference_id.split('|').map(&:to_i)
      payment.user_id = user_id
      payment.company_id = company_id
    end

    if wcr.state == 'authorized' || wcr.state == 'approved'
      user_id, company_id, months = wcr.reference_id.split('|').map(&:to_i)
      last_payment = Payment.most_recent_for_company(company_id)
      expire_date = (last_payment && last_payment.expire_date) || Date.today

      payment.sub_state = 'active' if wcr.period

      # Since there is only one record per subscription, we must multiply
      # the time paid to get the final subscription expiration date
      time_paid =
        case wcr.period
        when 'monthly' then (months * 12).months
        when 'yearly' then (months * 3).months
        else months.months
        end

      payment.currency = wcr.currency
      payment.amount_paid = wcr.amount.to_s('F')
      payment.company.update_attribute :premium, true
      payment.expire_date = expire_date + time_paid
      puts "EXPRIE #{payment.expire_date}"

      # check for previous preapproval
      prevSub = WepayCheckoutRecord.last_preapproval_for_company(company_id, wcr.preapproval_id)
      if prevSub.present? && wcr.preapproval_id.present?
        puts "PREVIOUS SUBSCRIPTION #{prevSub}"
        cancel_preapproval prevSub.preapproval_id

        last_payment = Payment.most_recent_for_company(company_id)
        expire_date = (last_payment && last_payment.expire_date) || Date.today
        payment.expire_date = expire_date + time_paid
        puts "EXPRIE DATE 2 #{payment.expire_date}"
      end
    end

    case wcr.state
    when /^(authorized|reserved|captured|settled)$/ then payment.is_valid = true
    when /^(failed|refunded|chargeback)$/ then
      payment.is_valid = false
      UserMailer.notify_bad_payment(payment, wcr.state).deliver
    when /^(stopped)$/ then
      # Only preapprovals have a `stopped` state
      if payment.sub_state == 'active'
        puts "FAILED SUBSCRIPTION PAYMENT #{wcr.preapproval_id}"
        payment.expire_date = payment.next_charge_date
        payment.sub_state = 'cancelled'
        UserMailer.notify_subscription_payment_failure(payment).deliver
      end
    when /^(cancelled)$/ then
      # Manually cancelled. Don't modify payment validitidy, but update expire date
      if payment.sub_state == 'active'
        puts "CANCELLING #{wcr.preapproval_id}"
        payment.expire_date = payment.next_charge_date
        payment.sub_state = 'cancelled'
      end
    end
    payment.save
    payment.company.recalculate_premium
  end
end
