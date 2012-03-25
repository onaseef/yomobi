require './lib/subdomain.rb'

# Load the rails application
require File.expand_path('../application', __FILE__)

# used in follower.rb
DUPLICATE_ERROR_MESSAGES = ["Duplicate entry", "duplicate key", "not unique"]

# used in signup_controller.rb
RESERVED_SITE_URLS = %w{
  about account-setup admin builder confirm confirmation easy
  home mobile opt-out order preview terms users widgets www
  how-to-make-a-mobile-website
}

# used in informed_controller.rb
SHORT_URL_RESERVED_COUNT = 23

# used in builder_controller.rb, among other places
MAX_COMPANY_NAME_LENGTH = 45
MAX_COMPANY_SLOGAN_LENGTH = 90

# used in site_manager_controller.rb
MAX_SITE_COUNT = 30

# Initialize the rails application
Yomobi::Application.initialize!
