class BuilderController < ApplicationController
  
  before_filter :authenticate_user!
  before_filter :ensure_user_has_already_setup
  
  def index
    @user = current_user
    @company = @user.company
    @open_edit_settings = true if flash[:edit_settings] == true
  end
  
  def new_widget
    return error 'Not a new document' unless params[:id].nil?
    db = CouchRest.database(current_user.company.couch_db_url)
    
    # scrub off rails related data
    params.delete :action; params.delete :controller
    
    res = db.save_doc(params)
    success params
  end
  
  def update_widget
    return error 'Invalid id' if params[:id].nil?
    db = CouchRest.database(current_user.company.couch_db_url)

    # scrub off rails related data
    wdata = params.clone
    wdata[:_id] = wdata[:id]; wdata.delete(:id)
    wdata.delete :action; wdata.delete :controller

    return error 'Bad data' unless handle_special_widget_cases(wdata)
    
    # couchrest adds _id and _rev to the hash on success
    res = db.save_doc(wdata)
    wdata[:email] = params[:email] if params[:email]
    success wdata
  end
  
  def delete_widget
    return error 'Invalid id'  if params[:_id].nil?
    return error 'Invalid rev' if params[:_rev].nil?

    db = CouchRest.database(current_user.company.couch_db_url)

    res = db.delete_doc(params)
    success params
  end
  
  def update_order
    return error 'Invalid id'  if params[:_id].nil?
    return error 'Invalid rev' if params[:_rev].nil?
    
    db = CouchRest.database(current_user.company.couch_db_url)

    # scrub off rails related data
    params.delete :action; params.delete :controller

    db.save_doc(params)
    success params
  end
  
  def change_settings
    if params[:company_name].present?
      cname = params[:company_name]

      attrs = {}
      attrs[:logo] = params[:logo] if params[:logo].present? && params[:destroy_logo] != "1"
      attrs[:name] = cname if cname.length > 2 && cname.length <= MAX_COMPANY_NAME_LENGTH
      attrs[:company_type] = CompanyType.find params[:company_type]

      attrs.delete :company_type if attrs[:company_type].nil?

      save_success = current_user.company.update_attributes(attrs)

      if save_success == false && current_user.company.errors[:logo_file_size]
        attrs.delete :logo
        flash[:alert] = 'The picture you have selected is too large. The maximum allowed size is 3MB.'
        # resave to prevent losing other changes
        current_user.company.update_attributes(attrs)
      end
    end

    if params[:destroy_logo] == "1"
      current_user.company.update_attribute :logo, nil
    end

    flash[:edit_settings] = true
    return redirect_to builder_main_path(:anchor => 'edit-settings')
  end

  def traffic_booster
    @user = current_user
    @company = @user.company
    return error 'bad keywords' if !params[:keywords].present?
    @company.keywords = params[:keywords]
    @company.save ? success(true) : error('server error')
  end

  private

  def handle_special_widget_cases(widget)
    email = widget[:email]

    case widget[:wtype]
    when 'informed'
      current_user.company.informed_email = email
      current_user.company.save
    when 'leave_msg'
      current_user.company.leave_msg_email = email
      current_user.company.save
    when 'call_back'
      current_user.company.call_back_email = email
      current_user.company.save
    when 'booking'
      current_user.company.booking_email = email
      current_user.company.save
    else
      true
    end
  end

end
