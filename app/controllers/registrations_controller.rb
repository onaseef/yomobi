class RegistrationsController < Devise::RegistrationsController

  def new
    @hide_signup_bar = true
    super
  end

  def create
    @hide_header_signin_form = true
    @hide_captcha = false
    @hide_signup_bar = true

    if verify_recaptcha
      super
      check_for_signup_key params[:user][:signup_key], resource
    else
      flash.now[:alert] = "There was an error with the recaptcha code below. Please re-enter the code and click submit."
      flash.discard :recaptcha_error

      build_resource
      clean_up_passwords(resource)
      render_with_scope :new
    end
  end

  def check_for_signup_key(key_str,user)
    signup_key = SignupKey.find_by_key key_str
    return if signup_key.nil? || signup_key.expired?

    # give user admin rights to site associated with key
    Key.create :user_id => user.id, :company_id => signup_key.company_id
    signup_key.expire!(self)
  end

  protected
  
  def after_sign_up_path_for(resource)
    account_setup_path 1
  end
  
  def after_inactive_sign_up_path_for(resource)
    account_setup_path 1
  end
end
