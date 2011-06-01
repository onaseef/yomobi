class BuilderController < ApplicationController
  
  before_filter :authenticate_user!
  before_filter :ensure_user_has_already_setup
  
  def index
    @user = current_user
    @company = @user.company
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
    else
      @errors[:message] = "Message length is too long (must be less than #{max_message_length} characters long)"
      @old_message = params[:message]
    end

    return render 'text_panel'
  end
  
  def new_widget
    return error 'Not a new document' unless params[:id].nil?
    db = CouchRest.database(current_user.company.couch_db_url)
    
    # TODO: scrub off rails related data
    
    puts "Params: #{params.inspect}"
    res = db.save_doc(params)
    puts "Response: #{res.inspect}"
    success params
  end
  
  def update_widget
    return error 'Invalid id' if params[:id].nil?
    db = CouchRest.database(current_user.company.couch_db_url)

    # TODO: scrub off rails related data
    params[:_id] = params[:id]; params.delete(:id)

    return error 'Bad data' unless handle_special_widget_cases(params)
    
    puts "Params: #{params.inspect}"
    # couchrest adds _id and _rev to the hash on success
    res = db.save_doc(params)
    puts "Response: #{res.inspect}"
    success params
  end
  
  def delete_widget
    return error 'Invalid id'  if params[:_id].nil?
    return error 'Invalid rev' if params[:_rev].nil?

    db = CouchRest.database(current_user.company.couch_db_url)
    puts "Params: #{params.inspect}"
    # TODO: scrub off rails related data
    res = db.delete_doc(params)
    puts "Response: #{res.inspect}"
    success params
  end
  
  def update_order
    return error 'Invalid id'  if params[:_id].nil?
    return error 'Invalid rev' if params[:_rev].nil?
    
    db = CouchRest.database(current_user.company.couch_db_url)
    # TODO: scrub off rails related data
    db.save_doc(params)
    success params
  end
  
  private
  
  def ensure_user_has_already_setup
    redirect_to(account_setup_path 1) if current_user.company.nil?
  end
  
  def valid_text_message?(msg)
    msg.size < max_message_length
  end

  def max_message_length
    160 - (" To Unsubscribe: ".length + SHORT_URL_RESERVED_COUNT)
  end

  def handle_special_widget_cases(widget)
    case widget[:wtype]
    when 'informed'
      current_user.company.informed_email = widget[:email]
      current_user.company.save
    when 'leave_msg'
      current_user.company.leave_msg_email = widget[:email]
      current_user.company.save
    else
      true
    end
  end

end
