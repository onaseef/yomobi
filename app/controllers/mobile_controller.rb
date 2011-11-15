class MobileController < ApplicationController
  def index
    @is_preview_mode = params[:preview].present?
    @company = Company.where(:db_name => params[:company].downcase).first
    # TODO: create "Company not found" page and redirect there instead
    redirect_to root_path if @company.nil?
  end

  def aritcaptcha
    render :layout => false
  end

  def mobile_redirect
    @exceptions = cookies.keys.map {|name| name[/^noredirect::(.*)/,1]}.compact
    render 'mobile/mobile_redirect.js', :layout => false
  end
end
