class Widgets::LeaveMsgController < ApplicationController
  
  def submit
    unless params[:feedback].present? && params[:email].present? && params[:subject].present?
      return error('bad message')
    end

    company = Company.find_by_db_name params[:company]
    return error('bad message') if company.nil?

    UserMailer.leave_msg({
      :to => company.leave_msg_email,
      :subject => 'You received customer feedback!',
      :from => 'feedback@yomobi.com',
      :customer_subject => params[:subject],
      :customer_feedback => params[:feedback],
      :customer_email => params[:email]
    }).deliver
    return success :msg => params[:feedback]
  end
end
