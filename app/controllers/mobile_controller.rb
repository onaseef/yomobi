class MobileController < ApplicationController

  def index
    @company = Company.find_by_db_name(params[:company].downcase) if params[:company]

    if @company.nil?
      site_ref = MobileDomain.get_mobile_reference(request)
      return redirect_to(root_url :subdomain => 'www') if site_ref == false
      if site_ref =~ /^redirect:/
        db_name = site_ref.split(':')[1]
        puts "ROOT: http://#{db_name}.#{Rails.application.config.app_domains.first}"
        return redirect_to("http://#{db_name}.#{Rails.application.config.app_domains.first}")
      end

      @company = Company.find_by_id(site_ref) if site_ref.is_a? Integer
      @company = Company.find_by_db_name(site_ref) if site_ref.is_a? String
    end

    return redirect_to(root_url :subdomain => 'www') if @company.nil?
    # TODO: create "Company not found" page and redirect there instead

    @is_preview_mode = params[:preview].present?
  end

  def aritcaptcha
    render :layout => false
  end

  def mobile_redirect
    @exceptions = cookies.map {|name, value| name[/^noredirect::(.*)/,1]}.compact
    render 'mobile/mobile_redirect.js', :layout => false
  end
end
