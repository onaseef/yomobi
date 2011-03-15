class BuilderController < ApplicationController
  def index
    db = CouchRest.database("http://admin_chipotle:123123@yomobi.couchone.com/chipotle")
    @widgets_in_use = widgets_in_use(db)
  end
  
  def update_widget
    return error 'Invalid id' if params[:id].nil?
    db = CouchRest.database("http://admin_chipotle:123123@yomobi.couchone.com/chipotle")
    params[:_id] = params[:id]; params.delete(:id)
    puts "Params: #{params.inspect}"
    res = db.save_doc(params)
    puts "Response: #{res.inspect}"
    success params
  end
  
  private
  
  def widgets_in_use(db)
    res = db.view('widgets/by_name')
    res['rows'].map {|r| r['key'][1] if r['key'][0].nil? }.compact
  end
end
