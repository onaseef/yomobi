class Widgets::LeaveMsgController < ApplicationController
  
  def submit
    unless params[:feedback].present? && params[:email].present? && params[:subject].present?
      return error('bad message')
    end
    return error('captcha') unless verify_aritcaptcha params

    site_name = params[:company] || request.subdomain
    company = Company.find_by_db_name site_name
    return error('bad message') if company.nil?
    return error('bad email') unless params[:email].match email_regex

    UserMailer.leave_msg({
      :to => company.leave_msg_email || company.user.email,
      :subject => params[:subject],
      :from => "\"YoMobi\" <message@yomobi.com>",
      :reply_to => params[:email],
      :customer_name => params[:name],
      :customer_subject => params[:subject],
      :customer_feedback => params[:feedback],
      :customer_email => params[:email],
      :company_mobile_url => company.mobile_url
    }).deliver
    return success :msg => params[:feedback]
  end
end
