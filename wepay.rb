require './WePay_API_v2_Ruby_SDK.rb'

# creates a wepay object you can use to make calls
wepay = WePay.new('175290', 'fb0167863f')
access_token = 'b009f8dac83038f2df195a9197470543ab36e4c8a8b3059eba8057138616b13d'

theme_object = {
  "name" => "yomobi-theme",
  "primary_color" => "FFFFFF",
  "secondary_color" => "000000",
  "background_color" =>"004C64",
  "button_color" => "0084A0"
}
params = {
  :client_id => '175290',
  :client_secret => 'fb0167863f',
  :theme_object => theme_object
}
# makes a call to the /user endpoint (which requires no parameters)
response = wepay.call('/app/modify', access_token, params)
puts response

# switching to production
# When you want to switch to production, change the _use_stage parameter on the WePay constructer to false.
