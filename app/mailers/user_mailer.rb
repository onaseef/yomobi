class UserMailer < ActionMailer::Base
  default :from => "\"YoMobi\" <message@yomobi.com>"

  def send_welcome_email(user)
    @mobile_url = user.company.mobile_url
    mail({
      :subject => "Welcome to YoMobi",
      :to => user.email,
      :from => 'support@yomobi.com'
    })
  end

  def leave_msg(params)
    @params = params
    mail params
  end

  def call_back(params)
    @params = params
    mail params
  end

  def tell_friend(params)
    @params = params
    mail params
  end

  def send_text(params)
    follower = params[:follower]
    @content = params[:content]
    @short_url = follower.short_url
    @company_name = params[:company].name
    
    old_settings = ActionMailer::Base.smtp_settings
    ActionMailer::Base.smtp_settings = Rails.application.config.text_smtp_settings

    mail(
      :subject => "From #{params[:company].name}",
      :to => "#{follower.phone}@#{follower.carrier.text_email}",
      :from => "\"YoMobi\" <message@yomobi.com>",
      :reply_to => params[:company].informed_email || params[:company].user.email
    )

    ActionMailer::Base.smtp_settings = old_settings
  end

  def email_follower(params)
    @params = params
    mail params
  end

  def booking_email(params)
    @params = params
    mail params
  end
end
