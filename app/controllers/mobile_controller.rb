class MobileController < ApplicationController
  def index
    @is_mobile = true
    @company = Company.where(:db_name => params[:company].downcase).first
    # TODO: create "Company not found" page and redirect there instead
    redirect_to root_path if @company.nil?
  end

  def aritcaptcha
    render :layout => false
  end
end
