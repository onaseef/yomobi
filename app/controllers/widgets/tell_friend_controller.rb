class Widgets::TellFriendController < ApplicationController

  def mobile_submit
    unless params[:email_to].present? && params[:email_from].present? && params[:name_from].present?
      return error('bad message')
    end

    company = Company.find_by_name params[:company]

    return error('bad company') if company.nil?
    return error('bad email to') unless params[:email_to].match email_regex
    return error('bad email from') unless params[:email_from].match email_regex

    UserMailer.tell_friend({
      :to => params[:email_to],
      :subject => "#{params[:name_from]} wants you to check out #{company.name}'s mobile website!",
      :from => params[:email_from],
      :name_from => params[:name_from],
      :company_mobile_url => company.mobile_url
    }).deliver
    return success :msg => params[:feedback]
  end

  private

  def email_regex
    ValidatesAsEmailAddress::RFC822::EmailAddress
  end
end
