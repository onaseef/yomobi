class MobileController < ApplicationController
  def index
    @company = Company.where(:db_name => params[:company]).first
    # TODO: create "Company not found" page and redirect there instead
    redirect_to root_path if @company.nil?
  end
end
