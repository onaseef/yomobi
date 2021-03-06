class Widgets::TellFriendController < ApplicationController

  def mobile_submit
    unless params[:email_to].present? && params[:name_from].present?
      return error('bad message')
    end

    site_name = params[:company] || request.subdomain
    company = Company.find_by_db_name site_name

    return error('bad company') if company.nil?
    return error('bad email to') unless params[:email_to].match email_regex

    UserMailer.tell_friend({
      :to => params[:email_to],
      :subject => t('tell_a_friend.email.subject', :friend_name => params[:name_from], :site_name => company.name),
      :from => "\"YoMobi\" <message@yomobi.com>",
      :name_from => params[:name_from],
      :company_mobile_url => company.mobile_url
    }).deliver
    return success :msg => params[:feedback]
  end
end
