# Load the rails application
require File.expand_path('../application', __FILE__)

# used in follower.rb
DUPLICATE_ERROR_MESSAGES = ["Duplicate entry", "duplicate key", "not unique"]

# used in builder_controller.rb
SHORT_URL_RESERVED_COUNT = 23

# Initialize the rails application
Yomobi::Application.initialize!
