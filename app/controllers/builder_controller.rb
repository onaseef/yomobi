class BuilderController < ApplicationController
  def index
    
  end
  
  def update_widget
    return error 'Invalid id' if params[:id].nil?
    db = CouchRest.database("http://admin_chipotle:123123@yomobi.couchone.com/chipotle")
    params[:_id] = params[:id]; params.delete(:id)
    puts params.inspect
    res = db.save_doc(params)
    puts res.inspect
    success params
  end
end
