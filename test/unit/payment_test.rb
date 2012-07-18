require 'test_helper'

describe Payment do

  before do
    WepayCheckoutRecordObserver.disabled = true
  end

  it "should handle a single payment expire and charge dates" do
    c = new_company
    sub = new_subscription(c, :now)

    sub.start_date.must_equal  Date.today
    sub.expire_date.must_equal  Date.today + 5.years
    sub.next_charge_date.must_equal  Date.today + 1.month

    # The company's expire date should be five years from the new subscription
    c.expire_date.must_equal  sub.start_date + 5.years
  end

  it "should start a new sub's charge date at the expire date" do
    c = new_company
    s1 = new_subscription(c, :now)
    s2 = new_subscription(c, :now)
    s1.reload # s2 should have cancelled s1; update data from db

    s1.sub_state.must_equal 'cancelled'
    # Cancelled subscriptions get their expire_date set to their time paid
    # (as opposed to the end of five years)
    s1.expire_date.must_equal  Date.today + 1.month

    # The new sub should start changing at the cancelled sub's expire date
    s2.next_charge_date.must_equal  s1.expire_date
  end

  it "should calculate next charge dates" do
    c = new_company
    # Starting on March 1/12, create sub on Feb 20/12
    s1 = new_subscription(c, 5.days.ago, :period => 'yearly')

    # One year has been charged.
    # The next charge date should be Feb 20/13
    expire_1 = (Date.today - 5.days + 1.year)
    s1.next_charge_date.must_equal  expire_1

    # In one year (March 1/13), the next charge date should be Feb 20/14
    Date.stub :today, (Date.today + 1.year), do
      s1.next_charge_date.must_equal (expire_1 + 1.year)
    end
    # In six months (Sep 1/12), the next charge date should be Feb 20/13
    Date.stub :today, (Date.today + 6.months), do
      s1.next_charge_date.must_equal expire_1
    end

    cancel_subscription(s1)

    # Since the sub hasn't started yet, next charge date should be its start date
    s2 = new_subscription(c, :now)
    s2.next_charge_date.must_equal  s2.start_date
    # New monthly sub. Next charge date should still be Feb 20/13
    s2.next_charge_date.must_equal  expire_1

    # In one year (March 1/13), the next charge date should be April 20/13
    Date.stub :today, (Date.today + 1.year), do
      s2.next_charge_date.must_equal (expire_1 + 1.month)
    end
  end

  it "should properly reset a cancelled subscription's expire date" do
    c = new_company

    # Create a subscription in the past
    s1 = new_subscription(c, 5.days.ago)
    cancel_subscription(s1)
    s1.is_valid.must_equal true

    # The cancelled sub's expire date should be at the end of paid time, not 5 years
    s1.expire_date.must_equal  c.expire_date

    # Since the sub was cancelled, company expire date should be in less than a month
    expire_1 = (Date.today - 5.days + 1.month)
    c.expire_date.must_equal(expire_1)

    s2 = new_subscription(c, :now); s1.reload; c.reload
    # The new subscription should start when the company would originally expire
    s2.start_date.must_equal  expire_1
    s2.expire_date.must_equal  expire_1 + 5.years
    s2.next_charge_date.must_equal  expire_1

    cancel_subscription(s2)
    # Since the subscription hasn't started yet, it should be marked as invalid
    s2.is_valid.must_equal false
  end

  it "should handle a payment with one invalid and one valid past cancelled payment" do
    c = new_company; s1, s2, s3 = nil

    # Create a subscription in the past
    s1 = new_subscription(c, 10.days.ago)
    cancel_subscription(s1)
    s1.is_valid.must_equal true
    s1.sub_state.must_equal 'cancelled'

    expire_1 = (Date.today - 10.days + 1.month)
    c.expire_date.must_equal  expire_1

    # Create a failed subscription in the past
    s2 = new_subscription c, 5.days.ago
    s2.start_date.must_equal  expire_1
    cancel_subscription(s2)

    # Since the subscription hasn't started yet, it should be marked as invalid
    s2.is_valid.must_equal false
    s2.sub_state.must_equal 'cancelled'

    # Company's expire date should remain the same
    c.reload;  c.expire_date.must_equal  expire_1

    # A new subscription should set correct expire dates
    s3 = new_subscription(c, :now)
    s1.reload; s2.reload; c.reload

    # The new sub should start changing at the last VALID sub's expire date
    s3.next_charge_date.must_equal  s1.expire_date
    # ...which should be the company's original expire date
    s3.next_charge_date.must_equal  expire_1
    s3.expire_date.must_equal  expire_1 + 5.years
  end

end
