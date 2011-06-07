class SignupController < ApplicationController
  require 'couch_docs'
  
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

    @errors['title'] = true unless data['title'].match /^[a-z0-9 _$()+-]{2,16}$/i

    if data['site_url'].match(/^[a-z][a-z0-9 _$()+-]{2,16}$/).nil?
      @errors['site_url'] = 'illegal'
    elsif couchdb_exists? data['site_url']
      @errors['site_url'] = 'taken'
    end
    
    if @errors.size == 0
      # TODO: randomly generate password
      result = current_user.create_company :name => data['title'], :db_name => data['site_url'], :db_pass => '123123'
      if result[:id].nil?
        @errors['site_url'] = 'taken?'
      elsif
        current_user.company.save_doc CouchDocs.about_us_doc(data['desc'])
      end
    end
    
    puts "Errors for step 1: #{@errors.inspect}"
  end
  
  def validate_step_2(data)
    puts "Validating step 2: #{data.inspect}"
    company = current_user.company
    company.save_doc CouchDocs.phone_doc(data['phone'])
    company.save_doc CouchDocs.gmap_doc(data['address'])
  end
  
  def validate_step_3(data)
    puts "Validating step 3: #{data.inspect}"
    success = current_user.company.update_attribute :logo, data['logo']
    puts "Updated logo? #{success.inspect}"
  end

  private
  
  def couchdb_exists?(db_name)
    db = CouchRest.database "http://yomobi.couchone.com/#{db_name}"
    begin
      return !db.info.nil?
    rescue RestClient::ResourceNotFound => nfe
      return false
    end
  end

end
