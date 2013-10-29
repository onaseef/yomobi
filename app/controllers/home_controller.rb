class HomeController < ApplicationController

  before_filter :redirect_if_signed_in, :only => :index
  before_filter :redirect_if_signed_out, :only => [:confirm_account, :resend_confirmation]
  before_filter :redirect_if_confirmed, :only => [:confirm_account]

  before_filter :show_landing_bar, :except => [:resend_confirmation, :confirm_account]

  def index
    prevent_caching
    redirect_to builder_main_path if user_signed_in?
    @user = User.new
    @page_wrapper_class = 'home'
    @hide_signup_bar = true
	render :layout => 'application_new'
  end

  def confirm_account
    @email = current_user.email
  end

  def resend_confirmation
    if current_user.confirmed?
      flash.now[:notice] = t'confirm_account.already_confirmed'
      @already_confirmed = true
      @email = current_user.email
      return render 'home/confirm_account'
    end

    Devise::Mailer.confirmation_instructions(current_user).deliver
    flash[:notice] = t'confirm_account.email_resent'
    return redirect_to confirm_account_path
  end

  def about
    @meta = {
      title: "Best Mobile Website Builder | Mobile Websites",
      description: "YoMobi pushes you into the mobile age. It's the best mobile website builder and  mobile website creator available. Create interactive mobile websites in minutes!",
      keywords: "best mobile website builder, mobile websites, mobile website creator, build mobile website free"
    }
  end

  def easy
  end

  def opportunities
    @meta = {
      title: "Build Mobile Website Free | Mobile Sites",
      description: "Contact YoMobi to gain more information on how you can help consumers utilize our mobile website builder. Minimal technical experience is needed in mobile websites.",
      keywords: "build mobile website free, mobile sites, mobile website builder, mobile websites, free mobile website"
    }
  end

  def plans
    @meta = {
      title: "Mobile Web Site Builder | Free Mobile Website",
      description: "YoMobi provides a website creator free so you can build a mobile site yourself . The mobile web site builder is easy to use and you can have your mobile web site up and running immediately.",
      keywords: "mobile web site builder, free mobile website, website creator free, mobile web site, build mobile website free"
    }
  end

  def privacy
  end

  def terms
  end

  def why_mobile
    @meta = {
      title: "Free Mobile Website Builder | Mobile Site",
      description: "YoMobi free mobile web site builder allows you to reach customers wherever they are. Our easy to use mobile website builder gives you the tools you need to reach your fans.",
      keywords: "free mobile website builder, mobile site, mobile web site, mobile website creator, mobile website builder"
    }
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
