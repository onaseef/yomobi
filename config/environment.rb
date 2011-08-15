# Load the rails application
require File.expand_path('../application', __FILE__)

# used in follower.rb
DUPLICATE_ERROR_MESSAGES = ["Duplicate entry", "duplicate key", "not unique"]

# used in informed_controller.rb
SHORT_URL_RESERVED_COUNT = 23

# used in builder_controller.rb, among other places
MAX_COMPANY_NAME_LENGTH = 45

# Initialize the rails application
Yomobi::Application.initialize!
