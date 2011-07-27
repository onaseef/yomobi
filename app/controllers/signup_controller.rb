class SignupController < ApplicationController
  require 'couch_docs'
  
  before_filter :redirect_unless_confirmed

  def account_setup
    @step_num = params[:step_num]
    return redirect_to account_setup_path(1) if current_user.company.nil? && @step_num.to_i >= 2
    return redirect_to builder_main_path if @step_num.to_i >= 4
    
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

    @errors['title'] = true unless data['title'].length > 2 && data['title'].length < 40

    if data['site_url'].match(/^[a-z0-9][a-z0-9_\-]{2,40}$/i).nil?
      @errors['site_url'] = 'illegal'
    elsif couchdb_exists? data['site_url'].downcase
      @errors['site_url'] = 'taken'
    end
    
    if @errors.size == 0
      # TODO: randomly generate password
      begin
        puts "Creating company with company_type_id: #{current_user.company_type_id}"
        result = current_user.create_company\
          :name => data['title'],
          :db_name => data['site_url'].downcase,
          :db_pass => '123123',
          :company_type_id => current_user.company_type_id
        if result[:id].nil?
          @errors['site_url'] = 'taken?'
        else
          current_user.company.save_doc CouchDocs.about_us_doc(data['desc'])
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
    company.save_doc CouchDocs.phone_doc(data['phone']) if data['phone'].present?
    company.save_doc CouchDocs.gmap_doc(data['address']) if data['address'].map{|k,v| v.present?}.any?
  end
  
  def validate_step_3(data)
    puts "Validating step 3: #{data.inspect}"
    success = current_user.company.update_attribute :logo, data['logo'] if data['logo']
    @errors['logo'] = true if data['logo'].present?
    puts "Updated logo? #{success.inspect}"
  end

  private
  
  def couchdb_exists?(db_name)
    db = CouchRest.database "http://#{Rails.application.config.couch_host}/m_#{db_name}"
    begin
      return !db.info.nil?
    rescue RestClient::ResourceNotFound => nfe
      return false
    end
  end

end
