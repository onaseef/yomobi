class SessionsController < Devise::SessionsController
  def new
    prevent_caching
    @hide_header_signin_form = true
    super
  end
end
