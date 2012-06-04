require 'rest-client'
require 'json'

theme_object = {
  "primary_color" => "FFFFFF",
  "secondary_color" => "000000",
  "background_color" =>"FFFFFF",
  "button_color" => "5B74A8"
}

params = {
  :client_id => "175290",
  :client_secret => "fb0167863f",
  :theme_object => "theme_object"
}

response = RestClient.post 'http://stage.wepayapi.com/v2/app/modify', params.to_json
puts response.inspect