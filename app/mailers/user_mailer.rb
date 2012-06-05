class UserMailer < ActionMailer::Base
  default :from => "\"YoMobi\" <message@yomobi.com>"

  def self.legal_headers
    @legal_headers ||= %W{to from subject reply_to}.map {|h| h.to_sym}
  end

  def send_welcome_email(user)
    @mobile_url = user.company.mobile_url
    mail({
      :subject => t('account.welcome_email.subject'),
      :to => user.email,
      :from => 'support@yomobi.com'
    })
  end

  def email_changed_notice(user,old_email)
    @old_email = old_email
    @new_email = user.email
    @mobile_url = user.company.mobile_url
    mail({
      :subject => t('account.username_changed_email.subject'),
      :to => [old_email, user.email],
      :from => 'support@yomobi.com'
    })
  end

  def leave_msg(params)
    @params = params
    mail scrub_headers params
  end

  def call_back(params)
    @params = params
    mail scrub_headers params
  end

  def tell_friend(params)
    @params = params
    mail scrub_headers params
  end

  def send_text(params)
    follower = params[:follower]
    @content = params[:content]
    @short_url = follower.short_url
    @company_name = params[:company].name
    mail(
      :subject => "From #{params[:company].name}",
      :to => "#{follower.phone}@#{follower.carrier.text_email}",
      :from => "\"YoMobi\" <message@yomobi.com>",
      :reply_to => params[:company].informed_email || params[:company].user.email
    )
  end

  def email_follower(params)
    @params = params
    mail scrub_headers params
  end

  def booking_email(params)
    @params = params
    mail scrub_headers params
  end

  def notify_bad_payment(payment, state)
    @payment = payment
    @payment_state = state
    mail(
      :subject => t('payments.email_bad.subject', :site_name => payment.company.name),
      :to => payment.user.email,
      :from => "\"YoMobi\" <message@yomobi.com>"
    )
  end

  def notify_subscription_payment_failure(payment)
    @payment = payment
    mail(
      :subject => t('payments.subscription_fail.subject', :site_name => payment.company.name),
      :to => payment.user.email,
      :from => "\"YoMobi\" <message@yomobi.com>"
    )
  end

  private

  # removes any illegal email headers
  def scrub_headers(headers)
    headers.select {|h| UserMailer.legal_headers.include? h}
  end
end
