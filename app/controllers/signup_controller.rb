class SignupController < ApplicationController
  require 'couch_docs'
  
  before_filter :authenticate_user!
  before_filter :redirect_unless_confirmed

  def account_setup
    @step_num = params[:step_num]
    return redirect_to account_setup_path(1) if current_user.company.nil? && @step_num.to_i >= 2

    if @step_num.to_i >= 4 || !current_user.company.nil? && @step_num.to_i == 1
      return redirect_to builder_main_path, :notice => 'Your account has already been setup.'
    end
    
    @errors = {}; @data = {}; @company = current_user.company || Company.new
    return render "signup/default/step-#{@step_num}" if params[:step_data].nil?

    send "validate_step_#{@step_num}", params[:step_data]
    
    if @errors.size > 0
      @data = params[:step_data]
      return render "signup/default/step-#{@step_num}"
    else
      return redirect_to account_setup_path(@step_num.to_i + 1)
    end
  end

  def validate_step_1(data)
    puts "Validating step 1: #{data.inspect}"
    
    return unless current_user.company.nil?

    @errors['title'] = true unless data['title'].length >= 2 &&
                                   data['title'].length < MAX_COMPANY_NAME_LENGTH

    if data['site_url'].match(/^[a-z0-9][a-z0-9_\-]{2,#{MAX_COMPANY_NAME_LENGTH}}$/i).nil?
      @errors['site_url'] = 'illegal'
    elsif reserved_site_url? data['site_url']
      @errors['site_url'] = 'reserved'
    elsif couchdb_exists? data['site_url'].downcase
      @errors['site_url'] = 'taken'
    end
    
    if @errors.size == 0
      # TODO: randomly generate password
      begin
        puts "Creating company with company_type_id: #{current_user.company_type_id}"
        result = current_user.companies.create \
          :name => data['title'],
          :db_name => data['site_url'].downcase,
          :db_pass => '123123',
          :company_type_id => current_user.company_type_id
        if result[:id].nil?
          @errors['site_url'] = 'taken?'
        else
          company = current_user.company

          if data['desc'].present?
            about_us_doc = company.get_widget_doc 'custom-page', 'About Us'
            if about_us_doc
              about_us_doc['content'] = data['desc']
              company.save_doc about_us_doc
            else
              company.save_doc(CouchDocs.about_us_doc data['desc'])
            end
          end

          UserMailer.send_welcome_email(current_user).deliver
        end
      rescue ActiveRecord::RecordNotUnique
        @errors['site_url'] = 'taken'
      end
    end
    
    puts "Errors for step 1: #{@errors.inspect}"
  end
  
  def validate_step_2(data)
    puts "Validating step 2: #{data.inspect}"
    company = current_user.company
    if data['phone'].present?
      phone_doc = company.get_widget_doc 'call-us'
      if phone_doc
        phone_doc['phone'] = data['phone']
        company.save_doc phone_doc
      else
        company.save_doc(CouchDocs.phone_doc data['phone'])
      end
    end

    if data['address'].reject {|k,v| k == 'country'}.map{|k,v| v.present?}.any?
      address_doc = company.get_widget_doc 'find-us'
      if address_doc
        new_data = data['address'].select {|k,v| v.present?}
        company.save_doc address_doc.merge( new_data )
      else
        company.save_doc(CouchDocs.gmap_doc data['address'])
      end
    end
  end
  
  def validate_step_3(data)
    puts "Validating step 3: #{data.inspect}"
    success = current_user.company.update_attribute :logo, data['logo'] if data['logo']
    @errors['logo'] = true if data['logo'].present?
    @company = current_user.company
    puts "Updated logo? #{success.inspect}"
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
