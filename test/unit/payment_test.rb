require 'test_helper'

describe Payment do

  before do
    WepayCheckoutRecordObserver.disabled = true
  end

  it "should handle a single payment expire and charge dates" do
    c = new_company
    p = new_payment(c, :now_monthly)

    p.start_date.must_equal  Date.today
    p.next_charge_date.must_equal  Date.today + 1.month
    p.expire_date.must_equal  Date.today + 5.years
  end

end
