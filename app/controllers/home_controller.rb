class HomeController < ApplicationController
  
  before_filter :redirect_if_logged_in
  
  def index
    redirect_to :controller => 'builder', :action => 'index' if user_signed_in?
    @user = User.new
  end
  
  def confirm_account
  end
  
  private
  
  def redirect_if_logged_in
    if current_user
      return redirect_to(account_setup_path 1) if current_user.company.nil?
      return redirect_to builder_main_path
    end
  end
  
end
