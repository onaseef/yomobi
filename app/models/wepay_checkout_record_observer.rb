class WepayCheckoutRecordObserver < ActiveRecord::Observer

  def after_update(wcr)
    return if wcr.state == 'expired'
    puts "UPDATING WEPAY RECORD #{wcr.id}: #{wcr.state} #{wcr.reference_id}"

    payment = Payment.find_or_create_by_wepay_checkout_record_id(wcr.id)
    if wcr.state == 'authorized' || wcr.state == 'approved'
      user_id, company_id, months = wcr.reference_id.split('|').map(&:to_i)
      last_payment = Payment.most_recent_for_company(company_id)
      expire_date = (last_payment && last_payment.expire_date) || Date.today

      time_paid = months.months

      payment.user_id = user_id
      payment.company_id = company_id
      payment.currency = wcr.currency
      payment.amount_paid = wcr.amount.to_s('F')
      payment.company.update_attribute :premium, true
      payment.expire_date = expire_date + time_paid
    end

    case wcr.state
    when %w{authorized reserved captured settled} then payment.valid = true
    when %w{cancelled failed refunded chargeback} then payment.valid = false
    end
    payment.save
  end
end
