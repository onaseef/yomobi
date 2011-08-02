class SessionsController < Devise::SessionsController
  def new
    prevent_caching
    @hide_header_signin_form = true
    @hide_signup_bar = true
    super
  end
end
