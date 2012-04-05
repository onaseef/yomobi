class WepayCheckoutRecord < ActiveRecord::Base
  # ignore some parameters
  attr_writer :mode, :prefill_info
end
