class WepayCheckoutRecordObserver < ActiveRecord::Observer

  def after_update(wcr)
    return if wcr.state == 'expired'
    puts "UPDATING WEPAY RECORD #{wcr.id}: #{wcr.state} #{wcr.reference_id}"

    payment = Payment.find_or_create_by_wepay_checkout_record_id(wcr.id)
    if wcr.state == 'authorized' || wcr.state == 'approved'
      payment.user_id, payment.company_id = wcr.reference_id.split('|').map(&:to_i)
      payment.currency = wcr.currency
      payment.amount_paid = wcr.amount.to_s('F')
      payment.company.update_attribute :premium, true
    end

    case wcr.state
    when %w{authorized reserved captured settled} then payment.valid = true
    when %w{cancelled failed refunded chargeback} then payment.valid = false
    end
    payment.save
  end
end
