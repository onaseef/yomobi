class Widgets::CallBackController < ApplicationController
  def mobile_submit
    unless params[:message].present? && params[:phone].present? && params[:name].present?
      return error('bad message')
    end

    return error('captcha') unless verify_aritcaptcha params
    

    company = Company.find_by_db_name params[:company]

    return error('bad company') if company.nil?
    return error('bad phone') unless phone_valid? params[:phone]

    UserMailer.call_back({
      :to => company.call_back_email || company.user.email,
      :subject => 'You have a call back request.',
      :from => "\"YoMobi\" <message@yomobi.com>",
      :customer_name => params[:name],
      :customer_phone => params[:phone],
      :customer_message => params[:message],
      :company_mobile_url => company.mobile_url
    }).deliver
    return success :msg => params[:feedback]
  end
end
