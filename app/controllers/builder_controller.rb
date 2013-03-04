class BuilderController < ApplicationController

  before_filter :authenticate_user!
  before_filter :ensure_user_has_already_setup

  def index
    @user = current_user
    @user.reset_authentication_token!
    @company = @user.company
    @open_edit_settings = true if flash[:edit_settings] == true
    @is_preview_mode = true
    @is_builder = true
  end

  def inc_id_counter
    @company = current_user.company
    @company.increment! :id_counter
    success :id => @company.id_counter
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
    wdata = sanitize_illegal_chars wdata
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

      company = current_user.company
      company.settings.header_color = params[:header_color]
      company.settings.header_text_color = params[:header_text_color]
      company.settings.slogan = params[:company_slogan]
      company.settings.save

      attrs = {}
      attrs[:logo] = params[:logo] if params[:logo].present? && params[:destroy_logo] != "1"
      attrs[:name] = cname if cname.length > 2 && cname.length <= MAX_COMPANY_NAME_LENGTH
      attrs[:company_type] = CompanyType.find params[:company_type]

      attrs.delete :company_type if attrs[:company_type].nil?

      save_success = company.update_attributes(attrs)

      if save_success == false && company.errors[:logo_file_size]
        attrs.delete :logo
        flash[:alert] = 'The picture you have selected is too large. The maximum allowed size is 3MB.'
        # resave to prevent losing other changes
        company.update_attributes(attrs)
      end
    end

    if params[:destroy_logo] == "1"
      current_user.company.update_attribute :logo, nil
    end

    flash[:edit_settings] = true
    return redirect_to builder_main_path(:anchor => 'edit-settings')
  end

  def change_advanced_settings
    @user = current_user
    @company = @user.company
    return error 'bad keywords' if !params[:keywords].present?

    @company.keywords = params[:keywords]
    if @company.save
      success :keywords => @company.keywords
    else
      error('server error')
    end
  end

  def customize
    settings = current_user.company.settings
    settings.attributes_from_params = params
    settings.save
    
    success(settings)
  end

  def upload_customize
    company = current_user.company
    return error 'not_premium' if company.premium? == false

    if params[:destroy] == "1" && params[:targetType] == 'banner'
      company.update_attribute :banner, nil
      success :banner => company.banner.url(:mobile)
    elsif params[:destroy] == "1" && params[:targetType] == 'body_bg'
      settings = company.settings
      settings.update_attribute :body_bg, nil
      success :body_bg => settings.banner.url(:mobile)
    elsif params[:targetType] == 'banner'
      save_success = company.update_attributes :banner => params[:file]

      if save_success == false && company.errors[:logo_file_size]
        error 'file_size_too_large'
      elsif save_success
        company.settings.update_attributes :banner_size => 'auto'
        success :banner => company.banner.url(:mobile)
      end
    elsif params[:targetType] == 'body_bg'
      settings = company.settings
      save_success = settings.update_attributes\
        :body_bg => params[:file],
        :body_bg_repeat => 'no-repeat'

      if save_success == false && settings.errors[:logo_file_size]
        error 'file_size_too_large'
      elsif save_success
        company.settings.update_attributes :body_bg_repeat => 'no-repeat'
        success :body_bg => settings.body_bg.url(:mobile)
      end
    end
  end

  def upload_wphoto
    params[:file].content_type = MIME::Types.type_for(params[:file].original_filename).to_s

    @company = current_user.company
    @photo = @company.wphotos.build \
      :photo => params[:file],
      :wid => params[:wid]

    if @photo.save
      puts "wphoto upload success; id=#{@photo[:id]}; url=#{@photo.photo.url(:thumb)}"
      render :json => { :result => 'success', :icon_url => @photo.photo.url(:icon) ,:wphotoUrl => @photo.photo.url(:thumb) }, :content_type => 'text/html'
    else
      render :json => { :result => 'fail' }, :content_type => 'text/html'
    end
  end

  private

  def handle_special_widget_cases(widget)
    email = widget['email']

    case widget['wtype']
    when 'informed'
      current_user.company.update_attribute :informed_email, email
    when 'leave_msg'
      current_user.company.update_attribute :leave_msg_email, email
    when 'call_back'
      current_user.company.update_attribute :call_back_email, email
    when 'booking'
      current_user.company.update_attribute :booking_email, email
    else
      true
    end
  end

  def sanitize_illegal_chars data
    stripped_hash = ActiveSupport::HashWithIndifferentAccess.new
    data.each_pair do |k,v|
      if v.is_a?(String)
        stripped_hash[k] = clear_unicode_newlines v
      elsif v.is_a?(ActiveSupport::HashWithIndifferentAccess)
        stripped_hash[k] = sanitize_illegal_chars v
      else
        stripped_hash[k] = v
      end
    end
    stripped_hash
  end
  def clear_unicode_newlines data
    data.gsub(/[\u000d\u0009\u000c\u0085\u2028\u2029\n]/,"<br/>")
  end

end
