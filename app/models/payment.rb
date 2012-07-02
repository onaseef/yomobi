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

  def start_date
    Time.at(self.wcr.start_time).to_date
  end

  def next_charge_date(base_time=nil)
    wcr = self.wepay_checkout_record
    return nil if wcr.end_time.nil?
    base_time ||= [Date.today, Time.at(wcr.start_time).to_date].max
    end_date = Time.at(wcr.end_time).to_date
    return nil if end_date < (base_time + 1.month)

    if wcr.period == 'monthly'
      offset = base_time > (Date.today + 1.month - 1.day) ? 0 : 1.month
      while end_date > base_time + offset
        end_date -= 1.month
      end
    elsif wcr.period == 'yearly'
      offset = base_time > (Date.today + 1.year - 1.day) ? 0 : 1.year
      while end_date > base_time + offset
        end_date -= 1.year
      end
    else
      return nil
    end
    end_date
  end

  def charge_history
    start_date = self.start_date
    end_date = [self.expire_date, Time.at(wcr.end_time).to_date, Date.today].min
    return [] if Date.today < start_date || !['monthly', 'yearly'].include?(wcr.period)

    dates = []
    step = (wcr.period == 'monthly') ? 1.month : 1.year

    while start_date <= end_date
      dates << start_date if start_date != self.expire_date
      start_date += step
    end

    dates
  end

  def wcr
    self.wepay_checkout_record
  end

  def ipn_url
    settings = WepayRails::Configuration.settings
    type = wcr.checkout_id.present? ? 'checkout_id' : 'preapproval_id'
    "#{settings[:root_callback_uri]}/wepay/ipn?security_token=#{wcr.security_token}&#{type}=#{wcr.send type}"
  end

  def force_ipn_update
    RestClient.post self.ipn_url, ''
  end

end
