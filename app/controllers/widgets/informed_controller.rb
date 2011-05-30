class Widgets::InformedController < ApplicationController
  
  def submit
    return error('bad message') unless follower_data_present? params

    company = Company.find_by_name params[:company]
    carrier = Carrier.find_by_name params[:carrier]

    return error('bad company') if company.nil?

    follower = company.followers.build \
      :carrier => carrier,
      :email   => params[:email],
      :phone   => params[:phone]

    follower.save_new ? success(nil) : error('bad data')
    puts "ERRORS: #{follower.errors.inspect}\nFOLLOWER: #{follower.inspect}"
  end

  private

  def follower_data_present? data
    data['email'].present? ||
    data['phone'].present? && data['carrier'].present?
  end
end
