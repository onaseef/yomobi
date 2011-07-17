class Company < ActiveRecord::Base
  require 'couch_docs'
  
  belongs_to :user
  belongs_to :company_type
  has_many :followers
  has_attached_file :logo,
    :styles => {
      :mobile => "100x75>"
    },
    :default_url => '/images/default-logo_:style.png',
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
      worder_doc = CouchDocs::worder_doc self.company_type_id
      
      default_docs = CouchDocs::default_docs self.company_type_id
      default_docs.push worder_doc, CouchDocs::view_doc

      # compact to remove deadly nil-related errors. Better to discover later
      # than to tell user "we just died, sorry about that"
      db.bulk_save default_docs.compact, false
      
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

  def text_followers
    followers.where(:company_id => self[:id], :active => true).select {|f| f.phone.present? }
  end

  def email_followers
    followers.where(:company_id => self[:id], :active => true).select {|f| f.email.present? }
  end
  
  def mobile_url
    "http://yomobi.com/#{db_name}"
  end

  def couch_host
    Rails.application.config.couch_host
  end

  def couch_db_url
    encoded_pass = URI.escape self.db_pass, Regexp.new("[^#{URI::PATTERN::UNRESERVED}]")
    puts "URL:::: http://admin_#{self.db_name}:#{encoded_pass}@#{Rails.application.config.couch_host}/m_#{self.db_name}"
    "http://admin_#{self.db_name}:#{encoded_pass}@#{Rails.application.config.couch_host}/m_#{self.db_name}"
  end
end
