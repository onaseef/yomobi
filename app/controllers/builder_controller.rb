class BuilderController < ApplicationController
  
  before_filter :authenticate_user!
  
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
    db = CouchRest.database(couch_db_url current_user.company)
    
    # TODO: scrub off rails related data
    params[:type] = 'widget-data'
    
    puts "Params: #{params.inspect}"
    res = db.save_doc(params)
    puts "Response: #{res.inspect}"
    success params
  end
  
  def update_widget
    return error 'Invalid id' if params[:id].nil?
    db = CouchRest.database(couch_db_url current_user.company)

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

    db = CouchRest.database(couch_db_url current_user.company)
    puts "Params: #{params.inspect}"
    # TODO: scrub off rails related data
    res = db.delete_doc(params)
    puts "Response: #{res.inspect}"
    success params
  end
  
  def update_order
    return error 'Invalid id'  if params[:_id].nil?
    return error 'Invalid rev' if params[:_rev].nil?
    
    db = CouchRest.database(couch_db_url current_user.company)
    # TODO: scrub off rails related data
    db.save_doc(params)
    success params
  end
  
  private
  
  def couch_db_url(company)
    puts "URL:::: http://admin_#{company.db_name}:#{company.db_pass}@yomobi.couchone.com/#{company.db_name}"
    "http://admin_#{company.db_name}:#{company.db_pass}@yomobi.couchone.com/#{company.db_name}"
  end
end
