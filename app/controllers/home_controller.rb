class HomeController < ApplicationController

  before_filter :redirect_if_signed_in, :only => :index
  before_filter :redirect_if_signed_out, :only => [:confirm_account, :resend_confirmation]
  before_filter :redirect_if_confirmed, :only => [:confirm_account]

  before_filter :show_landing_bar, :except => [:resend_confirmation, :confirm_account]

  def index
    prevent_caching
    redirect_to builder_main_path if user_signed_in?
    @user = User.new
    @page_wrapper_class = 'wrapper'
    @hide_signup_bar = true
  end

  def confirm_account
    @email = current_user.email
  end

  def resend_confirmation
    if current_user.confirmed?
      flash.now[:notice] = 'Your account has already been confirmed'
      @already_confirmed = true
      @email = current_user.email
      return render 'home/confirm_account'
    end

    Devise::Mailer.confirmation_instructions(current_user).deliver
    flash[:notice] = 'The confirmation email was resent. Please check your mailbox.'
    return redirect_to confirm_account_path
  end

  def ad_test
    render :layout => 'mobile_basic'
  end

  def privacy
  end

  def terms
  end

  def about
  end

  def easy
  end

  def why_mobile
  end

  def opportunity
  end

  private

  def redirect_if_signed_in
    if user_signed_in?
      return redirect_to(account_setup_path 1) if current_user.company.nil?
      return redirect_to builder_main_path
    end
  end

  def redirect_if_signed_out
    return redirect_to new_user_registration_path unless user_signed_in?
  end

  def redirect_if_confirmed
    return redirect_to(account_setup_path 1) if current_user.confirmed_at?
  end

  def show_landing_bar
    @landing_bar = true
  end

end
