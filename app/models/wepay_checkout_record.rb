class WepayCheckoutRecord < ActiveRecord::Base
  # ignore the mode parameter
  attr_writer :mode
end
