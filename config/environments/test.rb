Yomobi::Application.configure do

  # Configure static asset server for tests with Cache-Control for performance
  config.serve_static_assets = true
  config.static_cache_control = "public, max-age=3600"

  # Allow pass debug_assets=true as a query parameter to load pages with unpackaged assets
  config.assets.allow_debugging = true
  # Settings specified here will take precedence over those in config/application.rb

  config.app_domains = ['deelmob.com']
  config.re_app_domains = config.app_domains.map {|d| Regexp.escape d}.join '|'
  config.heroku_app_name = 'yomobi-test'

  config.opt_out_url_host = ENV['DEVISE_URL_HOST'] || 'deelmob.com'

  # In the development environment your application's code is reloaded on
  # every request.  This slows down response time but is perfect for development
  # since you don't have to restart the webserver when you make code changes.
  config.cache_classes = false

  # Log error messages when you accidentally call methods on nil.
  config.whiny_nils = true

  # Show full error reports and disable caching
  config.consider_all_requests_local       = true
  #config.action_view.debug_rjs             = true
  config.action_controller.perform_caching = false

  # Don't care if the mailer can't send
  config.action_mailer.raise_delivery_errors = false

  # Print deprecation notices to the Rails logger
  config.active_support.deprecation = :log

  # Only use best-standards-support built into browsers
  config.action_dispatch.best_standards_support = :builtin

  # use postfix on da local machine
  # ActionMailer::Base.smtp_settings = {
    # :host => "localhost"
  # }

  # use gmail for test emailing
  # config.action_mailer.delivery_method = :smtp
  # config.action_mailer.raise_delivery_errors = true
  # config.action_mailer.default_url_options = { :host => "local.host:3000" }
  # ActionMailer::Base.smtp_settings = {
  #   :address  => "smtp.gmail.com",
  #   :port  => 587,
  #   :user_name  => "yomobi.test",
  #   :password  => "y0Yoy@filler",
  #   :authentication  => :plain,
  #   :enable_starttls_auto => true
  # }

  if ENV['SES_KEY'] && ENV['SES_SECRET']
    puts "Using separate auth keys for Amazon SES"
    ActionMailer::Base.add_delivery_method :ses, AWS::SES::Base,
      :access_key_id => ENV['SES_KEY'],
      :secret_access_key => ENV['SES_SECRET']
  end

  config.action_mailer.raise_delivery_errors = true
  config.action_mailer.default_url_options = {
    :host => ENV['ACTION_MAILER_HOST'] || 'local.host:3000'
  }


  Slim::Engine.set_default_options :pretty => true
end
