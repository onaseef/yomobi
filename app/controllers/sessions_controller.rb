class SessionsController < Devise::SessionsController
  layout 'application_loco'

  def new
    prevent_caching
    @hide_header_signin_form = true
    @hide_signup_bar = true
    # Meta information for sign in (/users/sign_in) page
    @meta = {
      title: "Mobile Web Sites | Website Creator Free",
      description: "Sign in to YoMobi's mobile website creator to design or manage your free mobile website.",
      keywords: "mobile web sites, website creator free, mobile website creator, free mobile website, mobile website builder"
    }
    super
  end
end
