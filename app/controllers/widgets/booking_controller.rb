class Widgets::BookingController < ApplicationController

  def mobile_submit
    unless params[:name].present? && params[:phone].present? &&
           params[:time].present? && params[:time].length == 8 &&
           params[:date_m].present? && params[:date_d].present? && params[:date_y].present?
      return error('bad message')
    end

    return error('captcha') unless verify_aritcaptcha params

    site_name = params[:company] || request.subdomain
    company = Company.find_by_db_name site_name
    return error('bad company') if company.nil?

    phone = params[:phone]
    return error('bad phone') unless phone_valid? phone

    date = "#{params[:date_m]}/#{params[:date_d]}/#{params[:date_y]}"

    UserMailer.booking_email({
      :to => company.booking_email || company.user.email,
      :subject => 'You have a booking request.',
      :from => "\"YoMobi\" <message@yomobi.com>",
      :name => params[:name],
      :phone => params[:phone],
      :party_size => params[:party_size],
      :time => params[:time],
      :date => date,
      :company_name => company.name,
      :company_mobile_url => company.mobile_url
    }).deliver
    return success :msg => params[:details]
  end

end
