class Widgets::InformedController < ApplicationController
  layout "builder"

  def mobile_submit
    return error('bad message') unless follower_data_present? params

    company = Company.find_by_name params[:company]
    carrier = Carrier.find_by_name params[:carrier]

    return error('bad company') if company.nil?

    follower = company.followers.build \
      :carrier => carrier,
      :email   => params[:email],
      :phone   => params[:phone]

    follower.save_new ? success(nil) : error('bad data')
    puts "ERRORS: #{follower.errors.inspect}\nFOLLOWER: #{follower.inspect}"
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

    if @company.informed_email.nil?
      @errors[:message] = "Your 'Keep Me Informed' widget does not have a valid email"
      @old_message = params[:message]
    elsif valid_text_message? params[:message]
      @company.text_followers.each {|f| f.send_text params[:message]}
      flash[:notice] = 'Texts successfully sent'
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

    if @company.informed_email.nil?
      @errors[:no_email] = "Your 'Keep Me Informed' widget does not have a valid email"
      @old_subject = params[:subject]
      @old_content = params[:content]
    else
      @company.email_followers.each {|f| f.send_email params[:subject], params[:content]}
      flash[:notice] = "Email successfully sent."
    end

    return render 'email_panel'
  end

  def opt_out
    follower = Follower.find_by_opt_out_key params[:key]
    return redirect_to root_path if follower.nil?

    @company_name = follower.company.name
    follower.destroy

    render :layout => 'application'
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
    160 - (" To Unsubscribe: ".length + SHORT_URL_RESERVED_COUNT)
  end
end
