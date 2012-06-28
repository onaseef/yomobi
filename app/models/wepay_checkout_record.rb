class WepayCheckoutRecord < ActiveRecord::Base
  # ignore some parameters
  attr_writer :mode, :prefill_info
  has_one :payment

  def self.last_preapproval_for_company(company_or_id, exception_id=nil)
    cid = company_or_id.is_a?(Company) ? company_or_id.id : company_or_id
    sql = joins(:payment)
      .where('payments.company_id' => cid,
             'payments.is_valid' => true,
             'wepay_checkout_records.checkout_id' => nil)
      .where('wepay_checkout_records.preapproval_id IS NOT NULL')
      .where('wepay_checkout_records.state != ?', 'cancelled')
    ;
    if exception_id
      sql = sql.where('wepay_checkout_records.preapproval_id != ?', exception_id)
    end
    sql.order('created_at DESC').first
  end
end
