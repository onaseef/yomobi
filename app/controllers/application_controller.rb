class ApplicationController < ActionController::Base
  protect_from_forgery

  before_filter :admob_set_cookie
  
  def error(status = 400, reason)
    render :text => reason.to_json, :status => status
  end
  
  def success(status = 200, data)
    render :json => (data || {}).to_json, :status => status
  end
  
  def couch_url(db_name=nil,db_pass=nil)
    # This is so company.rb can use this method too, albeit ugly
    ApplicationController::couch_url(db_name,db_pass)
  end

  def self.couch_url(db_name=nil,db_pass=nil)
    couch_host = Rails.application.config.couch_host
    return "http://#{couch_host}" if db_name.nil?
    return "http://#{couch_host}/#{db_name}" if db_name == '_users'
    return "http://#{couch_host}/m_#{db_name}" if db_pass.nil?

    if db_pass == :@admin
      user, pass = Rails.application.config.couch_cred
      return "http://#{user}:#{pass}@#{couch_host}/m_#{db_name}"
    end
    "http://admin_#{db_name}:#{db_pass}@#{couch_host}/m_#{db_name}"
  end
  
  def prevent_caching
    response.headers["Cache-Control"] = "no-cache, no-store, max-age=0, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "Fri, 01 Jan 1990 00:00:00 GMT"
  end

  def email_regex
    ValidatesAsEmailAddress::RFC822::EmailAddress
  end

  # devise
  def after_sign_in_path_for(resource)
    return account_setup_path(1) if resource.company.nil?
    '/builder/main'
  end

  def ensure_user_has_already_setup
    redirect_to(account_setup_path 1) if current_user.company.nil?
  end

  # admob
  def admob_set_cookie
    AdMob::set_cookie(request, cookies)
  end
end
