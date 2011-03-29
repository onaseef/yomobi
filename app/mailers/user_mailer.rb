class UserMailer < ActionMailer::Base
  default :from => "feedback@yomobi.com"
  
  def leave_msg(params)
    @params = params
    mail params
  end
end
