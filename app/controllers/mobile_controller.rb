class MobileController < ApplicationController
  def index
    @company = Company.where(:db_name => params[:company]).first
  end
end
