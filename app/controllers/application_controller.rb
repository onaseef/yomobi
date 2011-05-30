class ApplicationController < ActionController::Base
  protect_from_forgery
  
  def error(status = 400, reason)
    render :text => reason, :status => status
  end
  
  def success(status = 200, data)
    render :json => (data || {}).to_json, :status => status
  end
  
  def couch_url(db_name=nil,db_pass=nil)
    # This is so company.rb can use this method too, albeit ugly
    ApplicationController::couch_url(db_name,db_pass)
  end

  def self.couch_url(db_name=nil,db_pass=nil)
    return "http://yomobi.couchone.com" if db_name.nil?
    return "http://yomobi.couchone.com/#{db_name}" if db_pass.nil?
    return "http://yadmin:C0uch!tUp@yomobi.couchone.com/#{db_name}" if db_pass == :@admin
    "http://admin_#{db_name}:#{db_pass}@yomobi.couchone.com/#{db_name}"
  end
  
  # devise
  def after_sign_in_path_for(resource)
    return account_setup_path(1) if resource.company.nil?
    '/builder/main'
  end
end
