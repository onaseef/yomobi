class Widgets::LeaveMsgController < ApplicationController
  
  def submit
    unless params[:feedback].present? && params[:email].present? && params[:subject].present?
      return error('bad message')
    end
    return error('captcha') unless verify_aritcaptcha params

    company = Company.find_by_db_name params[:company]
    return error('bad message') if company.nil?
    return error('bad email') unless params[:email].match email_regex

    UserMailer.leave_msg({
      :to => company.leave_msg_email || company.user.email,
      :subject => 'You received customer feedback!',
      :from => 'feedback@yomobi.com',
      :customer_subject => params[:subject],
      :customer_feedback => params[:feedback],
      :customer_email => params[:email]
    }).deliver
    return success :msg => params[:feedback]
  end
end
