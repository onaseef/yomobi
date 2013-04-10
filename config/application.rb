require File.expand_path('../boot', __FILE__)

require 'rails/all'

# If you have a Gemfile, require the gems listed there, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(:default, :assets, Rails.env) if defined?(Bundler)

module Yomobi
  class Application < Rails::Application
    # Enable the asset pipeline
    config.assets.enabled = true

    # Version of your assets, change this if you want to expire all your assets
    config.assets.version = '1.0'

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Custom directories with classes and modules you want to be autoloadable.
    # config.autoload_paths += %W(#{config.root}/extras)

    # Only load the plugins named here, in the order given (default is alphabetical).
    # :all can be used as a placeholder for all plugins not explicitly named.
    # config.plugins = [ :exception_notification, :ssl_requirement, :all ]

    # Activate observers that should always be running.
    config.active_record.observers = :wepay_checkout_record_observer

    # Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
    # Run "rake -D time" for a list of tasks for finding time zone names. Default is UTC.
    # config.time_zone = 'Central Time (US & Canada)'

    # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
    config.i18n.available_locales = %w{en es es-ES fr fr-FR}
    config.i18n.load_path += Dir[Rails.root.join('config', 'locales', '**', '*.{rb,yml}').to_s]
    config.i18n.default_locale = :en

    # rails will fallback to config.i18n.default_locale translation
    config.i18n.fallbacks = true

    # JavaScript files you want as :defaults (application.js is always included).
    # config.action_view.javascript_expansions[:defaults] = %w(jquery rails)

    # Configure the default encoding used in templates for Ruby 1.9.
    config.encoding = "utf-8"

    # Configure sensitive parameters which will be filtered from the log file.
    config.filter_parameters += [:password]
    
    ENV['GOOGLE_API_KEY']='AIzaSyCYju_txi2rDOYN1ScW_hVjZcivaKAQs-c'
    ENV['ARITCAPTCHA_S3_BUCKET']='yomobi-test'
    ENV['COUCH_ADMIN_PASS']='pw0Rd4yAdm1n'
    ENV['COUCH_ADMIN_USER']='yadmin'
    ENV['COUCH_HOST']='yomobi.iriscouch.com'
    ENV['DATABASE_URL']='postgres://fmibrhnotfnjfv:5QLCzN0llNGOkjVsSCqDtPdYro@ec2-23-23-234-207.compute-1.amazonaws.com:5432/d5295p7o9s8eb1'
    ENV['GEM_PATH']='vendor/bundle/ruby/1.9.1'
    ENV['LOGO_S3_BUCKET']='yomobi-test'
    ENV['MONGOHQ_URL']='mongodb://ymdev:m0ngo_D3v@linus.mongohq.com:10083/yomobi_staging_01'
    ENV['SES_KEY']=ENV['S3_KEY']='AKIAJWX3FCZORSXSHARA'
    ENV['SES_SECRET']=ENV['S3_SECRET']='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'
    ENV['MONGOID_HOST']='linus.mongohq.com'
    ENV['MONGOID_PORT'] ='10083'
    ENV['MONGOID_USERNAME']='ymdev' 
    ENV['MONGOID_PASSWORD']='m0ngo_D3v'
    ENV['MONGOID_DATABASE'] ='yomobi_staging_01'

    # CouchDB authentication
    config.couch_host = ENV['COUCH_HOST']
    config.couch_cred = [ENV['COUCH_ADMIN_USER'], ENV['COUCH_ADMIN_PASS']]

    # Amazon S3
    config.aritcaptcha_s3_bucket = ENV['ARITCAPTCHA_S3_BUCKET']
    config.logo_s3_bucket = ENV['LOGO_S3_BUCKET']
    config.s3_base_path = "http://s3.amazonaws.com"

    # Amazon Simple Emailing
    ActionMailer::Base.add_delivery_method :ses, AWS::SES::Base,
      :access_key_id => ENV['S3_KEY'],
      :secret_access_key => ENV['S3_SECRET']
    config.action_mailer.delivery_method = :ses

    config.generators do |g|
      g.orm :active_record
    end
    
    config.test_drive_db_name = ENV['TEST_DRIVE_DB_NAME'] || 'test-drive'
  end
end
