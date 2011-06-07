class Widgets::LeaveMsgController < ApplicationController
  
  def submit
    return error('bad message') if (params[:msg_content] || '').empty?

    UserMailer.leave_msg({
      :to => company.leave_msg_email,
      :subject => 'You received customer feedback!',
      :from => 'feedback@yomobi.com',
      :feedback => params[:msg_content]
    }).deliver
    return success :msg => params[:msg_content]
  end
end
