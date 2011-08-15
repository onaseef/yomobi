class Widgets::TellFriendController < ApplicationController

  def mobile_submit
    unless params[:email_to].present? && params[:name_from].present?
      return error('bad message')
    end

    company = Company.find_by_db_name params[:company]

    return error('bad company') if company.nil?
    return error('bad email to') unless params[:email_to].match email_regex

    UserMailer.tell_friend({
      :to => params[:email_to],
      :subject => "#{params[:name_from]} wants to share #{company.name} with you.",
      :from => "\"YoMobi\" <message@yomobi.com>",
      :name_from => params[:name_from],
      :company_mobile_url => company.mobile_url
    }).deliver
    return success :msg => params[:feedback]
  end
end
