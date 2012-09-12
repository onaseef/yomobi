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

  def new_subscription(company, start_time, opts={})
    wcr = wcrs(:now).clone
    wcr.reference_id = "#{users(:bob).id}|#{company.id}|#{wcr.period}|#{ActiveSupport::SecureRandom.uuid}"
    wcr.preapproval_id += rand_num(10)

    company.reload

    start_time = (start_time == :now) ? Date.current : start_time.to_date
    Date.stub :current, start_time, do
      # MIRRED FROM site_manager_controller.rb:244
      now = Date.current
      base_date = [company.next_charge_date, company.hard_expire_date, now].compact.max
      base_date = now if base_date < now
      #/MIRRED

      wcr.start_time = base_date.to_time.to_i
      wcr.end_time = (base_date + 5.years).to_time.to_i
    end
    wcr.period = opts[:period] || 'monthly' if opts
    wcr.save!

    payment = nil
    WepayCheckoutRecordObserver.stub :cancel_preapproval, lambda {|preapproval_id|
      record = WepayCheckoutRecord.find_by_preapproval_id(preapproval_id)
      if record
        record.update_attribute(:state, 'cancelled')
        WepayCheckoutRecordObserver.after_update(record)
      end
      record
    } do
      payment = WepayCheckoutRecordObserver.after_update(wcr)
    end

    unless opts[:skip_capture]
      capture_payment(payment)
    end
    payment
  end

  def capture_payment(sub)
    # Emulate WePay's capture IPN
    sub.wcr.update_attribute(:state, 'captured')
    WepayCheckoutRecordObserver.after_update(sub.wcr)
  end

  def cancel_subscription(sub)
    record = sub.wcr
    if record
      record.update_attribute(:state, 'cancelled')
      WepayCheckoutRecordObserver.after_update(record)
    end
    sub.reload
    record
  end

  def rand_num(length)
    (1..length).map {|n| rand(10)}.join('').to_i
  end
end
