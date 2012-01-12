class SiteManagerController < ApplicationController
  def index
    @companies = current_user.companies
    puts "JSON: #{@companies.to_json}"
  end

  def make_active
    company = Company.find_by_id params[:id]
    if company.user == current_user
      current_user.active_company_id = company.id
    end
    redirect_to builder_main_path
  end

  def create
  end

  def delete
  end

  def make_default
  end

  def add_admin
  end

  def remove_admin
  end

  def gen_signup_key
  end

end
