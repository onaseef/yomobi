class HomeController < ApplicationController
  
  before_filter :redirect_if_logged_in, :except => :ad_test
  
  def index
    prevent_caching
    redirect_to :controller => 'builder', :action => 'index' if user_signed_in?
    @user = User.new
  end
  
  def confirm_account
  end
  
  def ad_test
  end

  private
  
  def redirect_if_logged_in
    if current_user
      return redirect_to(account_setup_path 1) if current_user.company.nil?
      return redirect_to builder_main_path
    end
  end
  
end
