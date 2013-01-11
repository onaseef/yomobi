require './lib/mobile_domain.rb'

# Load the rails application
require File.expand_path('../application', __FILE__)

# used in follower.rb
DUPLICATE_ERROR_MESSAGES = ["Duplicate entry", "duplicate key", "not unique"]

# used in signup_controller.rb
RESERVED_SITE_URLS = %w{
  about account-setup admin builder confirm confirmation easy
  home mobile opt-out order preview terms users widgets www
  how-to-make-a-mobile-website blog
}

OLD_SITES_URLS = %w{
  /yomobi 
  /all-star-shop
  /amg
  /austinfilmschool 
  /bis
  /chapmanairheat 
  /daybyday 
  /doggedeli 
  /gemininails 
  /grimajewellery
  /jeffmass
  /jsottawa
  /kebab
  /kennysburgers
  /marksouting
  /masterrousseaustaekwondo
  /mobilya
  /mygedlive
  /panolaschools
  /pilatesofjackson
  /respectme 
  /shandeez 
  /skydivetemple
  /twinphotographers
  /usstove
  /yellowe
}

# used in informed_controller.rb
TXT_MSG_MAX_LENGTH = 280
SHORT_URL_RESERVED_COUNT = 23

# used in builder_controller.rb, among other places
MAX_COMPANY_NAME_LENGTH = 45
MAX_COMPANY_SLOGAN_LENGTH = 90

# used in site_manager_controller.rb
MAX_SITE_COUNT = 30
MAX_DOMAIN_COUNT = 5

# maximum RSS feed entry count / max RSS feed entry count
# also update in _mobile-data-loader.html.erb
MAX_RSS_FEED_COUNT = 50

# Initialize the rails application
Yomobi::Application.initialize!
