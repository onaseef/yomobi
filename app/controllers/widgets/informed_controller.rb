class Widgets::InformedController < ApplicationController
  layout "builder"
  before_filter :authenticate_user!, :only => [:text_panel,:email_panel,:send_text]

  def mobile_submit
    return error('bad message') unless follower_data_present? params
    return error('captcha') unless verify_aritcaptcha params

    company = Company.find_by_db_name params[:company]
    carrier = Carrier.find_by_name params[:carrier]

    return error('bad company') if company.nil?

    save_success = true

    if params[:phone].present? && !carrier.nil?
      text_follower, isNew = find_or_build_follower company, {
        :phone => params[:phone].gsub(/[^0-9]+/,''),
        :carrier => carrier
      }
      save_success &&= isNew ? text_follower.save_new : text_follower.save
    else
      text_follower = Follower.new
    end

    if params[:email].present?
      email_follower, isNew = find_or_build_follower company, {
        :email => params[:email]
      }
      save_success &&= isNew ? email_follower.save_new : email_follower.save
    else
      email_follower = Follower.new
    end

    save_errors = text_follower.errors.merge email_follower.errors
    save_success ? success(nil) : error(save_errors)
    puts "ERRORS: #{save_errors.inspect}"
    puts "TEXT FOLLOWER: #{text_follower.inspect}"
    puts "EMAIL FOLLOWER: #{email_follower.inspect}"
  end

  def text_panel
    @user = current_user
    @company = @user.company
    @max_chars = max_message_length
    @errors = {}
  end

  def send_text
    @company = current_user.company
    @errors = {}
    @max_chars = max_message_length

    if !params[:message].present? || params[:message].length == 0
      @errors[:message] = "Please enter a message."
      @old_message = params[:message]
    elsif @company.informed_email.nil?
      @errors[:message] = "Your 'Keep Me Informed' widget does not have a valid email"
      @old_message = params[:message]
    elsif valid_text_message? params[:message]
      @company.text_followers.each {|f| f.send_text params[:message]}
      flash.now[:notice] = 'Texts successfully sent'
    else
      @errors[:message] = "Message length is too long (must be less than #{max_message_length} characters long)"
      @old_message = params[:message]
    end

    return render 'text_panel'
  end

  def email_panel
    @user = current_user
    @company = @user.company
    @max_chars = max_message_length
    @errors = {}
  end

  def send_email
    @company = current_user.company
    @errors = {}

    if !params[:subject].present? || params[:subject].length == 0 ||
       !params[:content].present? || params[:content].length == 0
      @errors[:no_email] = "Please enter both a subject and message."
      @old_subject = params[:subject]
      @old_content = params[:content]
    elsif @company.informed_email.nil?
      @errors[:no_email] = "Your 'Keep Me Informed' widget does not have a valid email"
      @old_subject = params[:subject]
      @old_content = params[:content]
    else
      @company.email_followers.each {|f| f.send_email params[:subject], params[:content]}
      flash.now[:notice] = "Email successfully sent."
    end

    return render 'email_panel'
  end

  def opt_out
    follower = Follower.find_by_opt_out_key params[:key]

    if follower
      @company_name = follower.company.name
      @company_url = follower.company.db_name
      @opt_out_type = follower.email ? 'email' : 'text'

      follower.active = false
      follower.save

      @opt_in_url = "#{Rails.application.config.opt_out_url_host}/#{@company_url}#page/keep-me-informed"
    end
    render :layout => 'mobile_basic'
  end

  private

  def follower_data_present? data
    data['email'].present? ||
    data['phone'].present? && data['carrier'].present?
  end

  def valid_text_message?(msg)
    msg.size < max_message_length
  end

  def max_message_length
    140 - (" To Unsubscribe: ".length + SHORT_URL_RESERVED_COUNT)
  end

  def find_or_build_follower(company,params)
    puts "\nBUILDING: #{params.inspect}"
    follower = Follower.where(params.reject {|k| k==:carrier}).first
    if follower
      puts "PREVIOUSLY ACTIVE"
      follower.active = true
      return [follower,false]
    end

    follower = company.followers.build \
      :carrier => params[:carrier],
      :email   => params[:email],
      :phone   => params[:phone]
    return [follower,true]
  end
end
