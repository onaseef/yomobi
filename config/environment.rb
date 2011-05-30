# Load the rails application
require File.expand_path('../application', __FILE__)

# used in follower.rb
DUPLICATE_ERROR_MESSAGES = ["Duplicate entry", "duplicate key", "not unique"]

# Initialize the rails application
Yomobi::Application.initialize!
