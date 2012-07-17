ENV["RAILS_ENV"] = "test"
require File.expand_path('../../config/environment', __FILE__)
require 'rails/test_help'

class ActiveSupport::TestCase
  # Setup all fixtures in test/fixtures/*.(yml|csv) for all tests in alphabetical order.
  #
  # Note: You'll currently still have to declare fixtures explicitly in integration tests
  # -- they do not yet inherit this setting
  fixtures :all

  # Add more helper methods to be used by all tests here...
  def wcrs(name)
    wepay_checkout_records(name)
  end

  def new_company
    c = companies(:site_a).clone
    c.db_name += rand_num(10).to_s
    c.save
    c
  end

  def new_payment(company, wcr_name)
    wcr = wcrs(:now_monthly).clone
    wcr.reference_id = "#{users(:bob).id}|#{company.id}|#{wcr.period}|#{ActiveSupport::SecureRandom.uuid}"
    wcr.save!
    WepayCheckoutRecordObserver.after_update(wcr)
  end

  def rand_num(length)
    (1..length).map {|n| rand(10)}.join('').to_i
  end
end
