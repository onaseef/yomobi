class Widgets::BookingController < ApplicationController

  def mobile_submit
    unless params[:name].present? && params[:phone].present? &&
           params[:time].present? && params[:time].count == 3 &&
           params[:date].present? && params[:date].count == 3
      return error('bad message')
    end

    company = Company.find_by_name params[:company]
    return error('bad company') if company.nil?

    phone = params[:phone]
    return error('bad phone') unless phone_valid? phone

    t = params[:time]
    time = "#{t[:h]}:#{t[:m]}#{t[:p]}"

    d = params[:date]
    date = "#{d[:m]}/#{d[:d]}/#{d[:y]}"

    UserMailer.booking_email({
      :to => company.booking_email,
      :subject => 'A customer has a booking request.',
      :from => 'booking@yomobi.com',
      :name => params[:name],
      :phone => params[:phone],
      :time => time,
      :date => date,
      :company_name => company.name
    }).deliver
    return success :msg => params[:details]
  end

  def phone_valid?(phone)
    phone.gsub(/[^0-9]+/,'').length == 10
  end

end
