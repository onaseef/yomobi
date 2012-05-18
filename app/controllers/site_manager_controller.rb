class SiteManagerController < ApplicationController
  include WepayRails::Payments
  require 'couch'

  before_filter :authenticate_user!
  before_filter :ensure_user_has_already_setup
  before_filter :ensure_user_owns_company,
                :only => [:add_admin, :remove_admin, :concede,
                          :add_domain, :remove_domain,
                          :gen_signup_key, :delete]

  def index
    @companies = current_user.all_companies
  end

  def make_active
    company = Company.find_by_id params[:id]
    if current_user.can_access_company?(company)
      current_user.update_attribute :active_company_id, company.id
    end
    redirect_to builder_main_path
  end

  def create
    # TODO: refactor and move validation to company model
    data = params[:site]; @errors = {}
    data['source_db_name'] = nil if data['source_db_name'] == 'www'

    @errors['title'] = true unless data['title'].length >= 2 &&
                                   data['title'].length < MAX_COMPANY_NAME_LENGTH

    if data['url'].match(/^[a-z0-9][a-z0-9_\-]{2,#{MAX_COMPANY_NAME_LENGTH}}$/i).nil?
      @errors['url'] = 'illegal'
    elsif reserved_site_url? data['url']
      @errors['url'] = 'reserved'
    elsif Couch::couchdb_exists? data['url'].downcase
      @errors['url'] = 'taken'
    end

    company_type = CompanyType.find_by_id data['type']
    if company_type.nil?
      @errors['type'] = 'invalid'
    end
    @errors['maxSiteCount'] = MAX_SITE_COUNT if current_user.companies.count >= MAX_SITE_COUNT

    if @errors.count == 0
      begin
        puts "Creating company with company_type_id: #{company_type}"
        result = current_user.companies.create \
          :name => data['title'],
          :db_name => data['url'].downcase,
          :db_pass => '123123',
          :company_type => company_type,
          :source_db_name => data['source_db_name']
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

  def concede
    unless current_user.valid_password? params[:password]
      return render :json => { :status => :error,
                               :reasons => { :password => true } }
    end

    new_owner = User.find_by_id params[:admin_id]
    errors = validate_company_admin(@company, new_owner)

    if errors.count > 0
      render :json => { :status => :error, :reasons => errors }
    else
      @company.owner = new_owner
      @company.save
      # remove new owner's access key, as it's no longer needed
      Key.where(:user_id => new_owner.id, :company_id => @company.id).delete_all

      # give previous owner admin access
      Key.create :user => current_user, :company => @company

      render :json => { :status => :ok, :site => @company }
    end
  end

  def delete
  end

  def make_default
    company = Company.find_by_id params[:id]
    errors = validate_company_admin(company, current_user)
    # ignore self error
    errors.reject! {|k| k == 'self'}

    if errors.count > 0
      render :json => { :status => :error, :reasons => errors }
    else
      current_user.update_attribute :default_company_id, company.id
      render :json => { :status => :ok }
    end
  end

  def add_admin
    admin = User.find_by_email params[:email]
    errors = validate_company_admin(@company, admin)

    if errors.count > 0
      render :json => { :status => :error, :reasons => errors, :email => params[:email] }
    else
      Key.create :user => admin, :company => @company
      render :json => { :status => :ok, :site => @company }
    end
  end

  def remove_admin
    admin = User.find_by_id params[:admin_id]
    errors = validate_company_admin(@company, admin)

    if errors.count > 0
      render :json => { :status => :error, :reasons => errors, :admin_id => params[:admin_id] }
    else
      Key.where(:user_id => admin.id, :company_id => @company.id).each {|key|
        key.user.update_attribute :active_company_id, nil
        key.delete
      }
      render :json => { :status => :ok, :site => @company }
    end
  end

  def add_domain
    if @company.domains.count >= MAX_DOMAIN_COUNT
      return render :json => { :status => :error, :reasons => { :max_domain_count => true }, :host => params[:host] }
    end

    domain = Domain.find_by_host(params[:host])
    if domain.present?
      return render :json => { :status => :error, :reasons => { :taken => true }, :host => params[:host] }
    end

    domain = Domain.create :host => params[:host], :company => @company
    errors = domain.errors

    if errors.count > 0
      render :json => { :status => :error, :reasons => errors, :host => params[:host] }
    else
      if ENV['HEROKU_API_KEY'].present?
        client = Heroku::Client.new('', ENV['HEROKU_API_KEY'])
        begin
          client.add_domain Rails.application.config.heroku_app_name, params[:host]
        rescue RestClient::UnprocessableEntity
          # The domain is most likely in use by another Heroku app
          return render :json => { :status => :error, :reasons => { :taken => true }, :host => params[:host] }
        end
      end
      render :json => { :status => :ok, :site => @company }
    end
  end

  def remove_domain
    domain = Domain.find_by_id params[:domain_id]

    if domain.nil?
      render :json => { :status => :error, :reasons => { :does_not_exist => true }, :host => params[:domain_id] }
    else
      if ENV['HEROKU_API_KEY'].present?
        client = Heroku::Client.new('', ENV['HEROKU_API_KEY'])
        begin
          client.remove_domain Rails.application.config.heroku_app_name, domain.host
        rescue RestClient::ResourceNotFound
          # A problem with heroku. Regardless, catch exception so we can delete
          # the domain from our local db
        end
      end
      domain.delete
      render :json => { :status => :ok, :site => @company }
    end
  end

  # generate signup key
  def gen_signup_key
    if (key = SignupKey.create :company => @company) != nil
      render :json => { :status => :ok,
                        :key => "#{new_user_registration_url}?sk=#{key}" }
    else
      render :json => { :status => :error }
    end
  end

  def upgrade
    return error 'agree_to_terms' unless params[:terms] == "on"

    months = params[:months].to_i
    months = 1 if params[:months] == "recur"

    return error 'select_length' if (months <= 0 || months > 12)

    if params[:id] && (@site = Company.find_by_id params[:id])

      @time = "#{months} months"
      @time = "1 year" if months == 12
      @time = "monthly" if params[:months] == "recur"
      user = current_user

      checkout_params = {
        :amount => 12 * months,
        :short_description => "YoMobi - [#{@site.db_name}]: Professional Site Payment (#{@time})",
        :long_description => "YoMobi - #{@site.url_and_name}: Professional Site Payment (#{@time})",
        :mode => 'iframe',
        :reference_id => "#{user.id}|#{@site.id}|#{months}|#{ActiveSupport::SecureRandom.uuid}",
        :prefill_info => { email:user.email, name:"#{user.first_name} #{user.last_name}" },
      }
      if params[:months] == "recur"
        checkout_params[:period] = 'monthly'
        checkout_params[:end_time] = (DateTime.now + 1.year).to_time.to_i
        checkout_params[:auto_recur] = true
        checkout_params[:api_url] = '/preapproval/create'
      else
        checkout_params[:type] = 'SERVICE'
      end
      @checkout = init_checkout(checkout_params)
      render :layout => false
    else
      return error 'site_not_specified'
    end
  end

  def cancel_subscription
    return error('no_site_id') unless params[:site_id].present?

    company = Company.find_by_id params[:site_id]
    return error('bad_site_id') unless company.present?

    record = WepayCheckoutRecord.last_preapproval_for_company(company)
    return error('no_subscription') unless company.present?

    begin
      cancel_preapproval record.preapproval_id
    rescue WepayRails::Exceptions::WepayCheckoutError => e
      if e.message =~ /already been cancelled/
        WepayCheckoutRecord.find(record.id).update_attribute :state, 'cancelled'
        return success :cancelSubscription => company.id
      else
        puts "CANCEL ERROR: #{e.inspect}"
        return error 'cancel_error'
      end
    else
      return success :cancelSubscription => company.id
    end
  end

  def thanks
    render :layout => false
  end

  private

  def ensure_user_owns_company
    @company = Company.find_by_id params[:id]
    if @company.owner != current_user
      render :json => { :status => :error,
                        :reasons => { :insufficient_permissions => true} }
      return false
    end
  end

  def reserved_site_url?(site_url)
    RESERVED_SITE_URLS.include? site_url
  end

  def validate_company_admin(company,admin)
    errors = {}
    if admin.nil?
      errors['email'] = true
    elsif company.nil? || company.owner != current_user
      # don't let them know they have access for security reasons
      errors['email'] = true
    elsif admin == current_user
      errors['self'] = true
    end
    return errors
  end

end
