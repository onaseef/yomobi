class Widgets::BookingController < ApplicationController

  def mobile_submit
    return error('bad message') if !params[:details].present? || !params[:phone].present?

    company = Company.find_by_name params[:company]
    return error('bad company') if company.nil?

    phone = params[:phone]
    return error('bad phone') unless phone_valid? phone

    UserMailer.booking_email({
      :to => company.booking_email,
      :subject => 'A customer has a booking request.',
      :from => 'booking@yomobi.com',
      :phone => params[:phone],
      :content => params[:details],
      :company_name => company.name
    }).deliver
    return success :msg => params[:details]
  end

  def phone_valid?(phone)
    phone.gsub(/[^0-9]+/,'').length == 10
  end

end
