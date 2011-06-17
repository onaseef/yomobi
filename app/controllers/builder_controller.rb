class BuilderController < ApplicationController
  
  before_filter :authenticate_user!
  before_filter :ensure_user_has_already_setup
  
  def index
    @user = current_user
    @company = @user.company
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
  
  def change_settings
    if params[:company_name].present?
      attrs = { :name => params[:company_name], :logo => params[:logo]}
      attrs.delete :logo unless params[:logo].present?
      attrs.delete :name unless attrs[:name].match /^[a-z0-9 _$()+-]{2,16}$/i

      save_success = current_user.company.update_attributes(attrs)
      puts "Updated settings? #{save_success.inspect}"
    end

    return redirect_to builder_main_path(:anchor => 'edit-settings')
  end

  def traffic_booster
    @user = current_user
    @company = @user.company
    return if !params[:keywords].present?
    @company.keywords = params[:keywords]
    flash.now[:notice] = "Keywords successfully saved" if @company.save
  end

  private

  def handle_special_widget_cases(widget)
    case widget[:wtype]
    when 'informed'
      current_user.company.informed_email = widget[:email]
      current_user.company.save
    when 'leave_msg'
      current_user.company.leave_msg_email = widget[:email]
      current_user.company.save
    when 'booking'
      current_user.company.booking_email = widget[:email]
      current_user.company.save
    else
      true
    end
  end

end
