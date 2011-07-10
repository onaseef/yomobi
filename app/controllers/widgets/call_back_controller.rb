class Widgets::CallBackController < ApplicationController
  def mobile_submit
    unless params[:message].present? && params[:phone].present?
      return error('bad message')
    end

    company = Company.find_by_db_name params[:company]

    return error('bad company') if company.nil?
    return error('bad phone') if !params[:phone].gsub(/[^0-9]+/,'').present?

    UserMailer.call_back({
      :to => company.call_back_email,
      :subject => 'A customer has left a message.',
      :from => 'feedback@yomobi.com',
      :customer_phone => params[:phone],
      :customer_message => params[:message]
    }).deliver
    return success :msg => params[:feedback]
  end
end
