class HomeController < ApplicationController
  
  before_filter :redirect_if_signed_in, :only => :index
  before_filter :redirect_if_signed_out, :only => [:confirm_account, :resend_confirmation]
  before_filter :redirect_if_confirmed, :only => [:confirm_account, :resend_confirmation]
  
  def index
    prevent_caching
    redirect_to builder_main_path if user_signed_in?
    @user = User.new
    @page_wrapper_class = 'home'
  end
  
  def confirm_account
    @email = current_user.email
  end

  def resend_confirmation
    Devise::Mailer.confirmation_instructions(current_user).deliver
    return redirect_to confirm_account_path
  end
  
  def ad_test
    render :layout => 'mobile_basic'
  end

  private
  
  def redirect_if_signed_in
    if user_signed_in?
      return redirect_to(account_setup_path 1) if current_user.company.nil?
      return redirect_to builder_main_path
    end
  end

  def redirect_if_signed_out
    return redirect_to account_signup_path unless user_signed_in?
  end

  def redirect_if_confirmed
    return redirect_to(account_setup_path 1) if current_user.confirmed_at?
  end
  
end
