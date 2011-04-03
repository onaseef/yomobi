class BuilderController < ApplicationController
  def index
  end
  
  def new_widget
    return error 'Not a new document' unless params[:id].nil?
    db = CouchRest.database("http://admin_chipotle:123123@yomobi.couchone.com/chipotle")
    
    # TODO: scrub off rails related data
    params[:type] = 'widget-data'
    
    puts "Params: #{params.inspect}"
    res = db.save_doc(params)
    puts "Response: #{res.inspect}"
    success params
  end
  
  def update_widget
    return error 'Invalid id' if params[:id].nil?
    db = CouchRest.database("http://admin_chipotle:123123@yomobi.couchone.com/chipotle")

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
    db = CouchRest.database("http://admin_chipotle:123123@yomobi.couchone.com/chipotle")
    puts "Params: #{params.inspect}"
    res = db.delete_doc(params)
    puts "Response: #{res.inspect}"
    success params
  end
end
