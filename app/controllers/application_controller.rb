class ApplicationController < ActionController::Base
  protect_from_forgery
  
  def error(status = 400, reason)
    render :json => {:status => 'error', :reason => reason}, :status => status
  end
  
  def success(status = 200, data)
    render :json => (data || {}).to_json, :status => status
  end
end
