class Company < ActiveRecord::Base
  require 'couch_docs'
  
  belongs_to :user
  has_many :followers
  has_attached_file :logo,
    :styles => {
      :mobile => "112x48>"
    },
    :storage => :s3,
    :bucket => 'yomobi',
    :path => 'logos/:company_:style',
    :s3_credentials => {
      :access_key_id => ENV['S3_KEY'],
      :secret_access_key => ENV['S3_SECRET']
    }
  
  before_create :create_couch, :unless => Proc.new {|c| c.db_pass == 'n0n-_-exist@nt??' }
  
  validates_attachment_size :logo, :less_than => 1.megabytes, :unless => Proc.new {|c| c.logo.nil? }
  
  def create_couch
    db = CouchRest.database(ApplicationController::couch_url self.db_name, :@admin)
    result = db.create!
    if result == true
      db.bulk_save [CouchDocs::view_doc, CouchDocs::worder_doc, CouchDocs::hours_doc], false
      
      # create new admin user
      user_doc = CouchDocs::admin_user_doc self.db_name, self.db_pass
      users_url = (ApplicationController::couch_url '_users', :@admin)
      CouchRest.database(users_url).save_doc user_doc
    end
    result
  end
  
  def save_doc(doc)
    CouchRest.database(couch_db_url).save_doc doc
  end
  
  def couch_db_url
    encoded_pass = URI.escape self.db_pass, Regexp.new("[^#{URI::PATTERN::UNRESERVED}]")
    puts "URL:::: http://admin_#{self.db_name}:#{encoded_pass}@yomobi.couchone.com/#{self.db_name}"
    "http://admin_#{self.db_name}:#{encoded_pass}@yomobi.couchone.com/#{self.db_name}"
  end
end
