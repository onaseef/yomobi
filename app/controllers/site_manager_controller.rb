class SiteManagerController < ApplicationController
  before_filter :authenticate_user!

  def index
    @companies = current_user.all_companies
  end

  def make_active
    company = Company.find_by_id params[:id]
    if current_user.can_access_company?(company)
      current_user.active_company_id = company.id
      current_user.save
    end
    redirect_to builder_main_path
  end

  def create
    # TODO: refactor and move validation to company model
    data = params[:site]; @errors = {}
    @errors['title'] = true unless data['title'].length >= 2 &&
                                   data['title'].length < MAX_COMPANY_NAME_LENGTH

    if data['url'].match(/^[a-z0-9][a-z0-9_\-]{2,#{MAX_COMPANY_NAME_LENGTH}}$/i).nil?
      @errors['url'] = 'illegal'
    elsif reserved_site_url? data['url']
      @errors['url'] = 'reserved'
    elsif couchdb_exists? data['url'].downcase
      @errors['url'] = 'taken'
    end

    company_type = CompanyType.find_by_id data['type']
    if company_type.nil?
      @errors['type'] = 'invalid'
    end

    if @errors.count == 0
      begin
        puts "Creating company with company_type_id: #{company_type}"
        result = current_user.companies.create \
          :name => data['title'],
          :db_name => data['url'].downcase,
          :db_pass => '123123',
          :company_type => company_type
        if result[:id].nil?
          @errors['url'] = 'taken?'
          render :json => { :status => :error, :reasons => @errors, :site => data }
        else
          current_user.active_company_id = result.id
          render :json => { :status => :ok, :site => result }
        end

      rescue ActiveRecord::RecordNotUnique
        @errors['url'] = 'taken'
        render :json => { :status => :error, :reasons => @errors, :site => data }
      end
    else
      render :json => { :status => :error, :reasons => @errors, :site => data }
    end
  end

  def delete
  end

  def make_default
  end

  def add_admin
    @errors = {}
    company = Company.find_by_id params[:site_id]
    admin = User.find_by_email params[:email]

    if admin.nil? || company.nil? || company.owner != current_user
      # don't let them know they have access for security reasons
      @errors['email'] = true
    elsif admin == current_user
      @errors['self'] = true
    end

    if @errors.count > 0
      render :json => { :status => :error, :reasons => @errors, :email => params[:email] }
    else
      Key.create :user => admin, :company => company
      render :json => { :status => :ok, :site => company }
    end
  end

  def remove_admin
  end

  def gen_signup_key
  end

  private

  def reserved_site_url?(site_url)
    RESERVED_SITE_URLS.include? site_url
  end

  def couchdb_exists?(db_name)
    db = CouchRest.database "http://#{Rails.application.config.couch_host}/m_#{db_name}"
    begin
      return !db.info.nil?
    rescue RestClient::ResourceNotFound => nfe
      return false
    end
  end

end
