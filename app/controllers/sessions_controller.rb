class SessionsController < Devise::SessionsController
  def new
    @hide_header_signin_form = true
    super
  end
end
