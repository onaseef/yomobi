class BuilderController < ApplicationController
  
  before_filter :authenticate_user!
  before_filter :ensure_user_has_already_setup
  
  def index
    @user = current_user
    @company = @user.company
  end
  
  def configure
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
  
end
