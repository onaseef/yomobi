class WepayCheckoutRecord < ActiveRecord::Base
  # ignore some parameters
  attr_writer :mode, :prefill_info
  has_one :payment

  def self.last_preapproval_for_company(company_or_id)
    cid = company_or_id.is_a?(Company) ? company_or_id.id : company_or_id
    joins(:payment)
      .where('payments.company_id' => cid,
             'wepay_checkout_records.checkout_id' => nil)
      .order('created_at DESC')
      .first
  end
end
