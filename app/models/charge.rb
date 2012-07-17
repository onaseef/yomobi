class Charge
  attr_reader :charge_date, :amount_paid, :site_url, :site_name, :preapproval_id

  def initialize(payment, charge_date)
    @charge_date = charge_date
    @amount_paid = payment.amount_paid
    @site_url = payment.company.site_url
    @site_name = payment.company.site_name
    @preapproval_id = payment.wcr.preapproval_id
  end
end
