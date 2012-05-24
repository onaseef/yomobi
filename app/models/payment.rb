class Payment < ActiveRecord::Base
  belongs_to :user
  belongs_to :company
  belongs_to :wepay_checkout_record

  composed_of :amount_paid,
    :class_name => "Money",
    :mapping => [%w(cents cents), %w(currency currency_as_string)],
    :constructor => Proc.new { |cents, currency| Money.new(cents || 0, currency || Money.default_currency) },
    :converter => Proc.new { |value| value.respond_to?(:to_money) ? value.to_money : raise(ArgumentError, "Can't convert #{value.class} to Money") }


  def self.most_recent_for_company(company_or_id)
    cid = company_or_id.is_a?(Company) ? company_or_id.id : company_or_id
    Payment.where(:company_id => cid, :is_valid => true).order('created_at DESC').first
  end

  def months
    (amount_paid / 12).to_s.to_i
  end

end
