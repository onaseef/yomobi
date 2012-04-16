class Company < ActiveRecord::Base
  require 'couch_docs'
  require 'couch'

  belongs_to :user
  alias :owner :user
  alias :owner= :user=
  belongs_to :company_type

  has_many :keys, :dependent => :delete_all
  has_many :admins, :through => :keys, :source => :user
  has_many :signup_keys, :dependent => :delete_all

  has_many :followers
  has_many :wphotos
  has_one :company_settings

  has_attached_file :logo,
    :styles => {
      :mobile => "100x75>",
      :original => "1x1#"
    },
    :default_url => '/images/default-logo_:style.png',
    :storage => :s3,
    :bucket => Rails.application.config.logo_s3_bucket,
    :path => 'logos/:company_:style',
    :s3_credentials => {
      :access_key_id => ENV['S3_KEY'],
      :secret_access_key => ENV['S3_SECRET']
    }

  has_attached_file :banner,
    :styles => {
      :mobile => "320x320>",
      :original => "1x1#"
    },
    :default_url => '',
    :storage => :s3,
    :bucket => Rails.application.config.logo_s3_bucket,
    :path => 'banners/:company_:style',
    :s3_credentials => {
      :access_key_id => ENV['S3_KEY'],
      :secret_access_key => ENV['S3_SECRET']
    }


  # If this site is a replication of another, then this attribute
  # should be set to the name of the couch database to replicate.
  attr_accessor :source_db_name

  before_create :create_couch, :unless => Proc.new {|c| c.db_pass == 'n0n-_-exist@nt??' }

  before_post_process :check_file_size
  validates_attachment_size :logo, :less_than => 3.megabytes, :unless => Proc.new {|c| c.logo.nil? }

  def create_couch
    db = CouchRest.database(ApplicationController::couch_url self.db_name, :@admin)
    result = db.create!

    if result == true && self.source_db_name.present? && Couch::couchdb_exists?(source_db_name)
      # replicate from another site instead of creating the default docs
      source_db_url = ApplicationController::couch_url self.source_db_name, :@admin
      db.replicate_from CouchRest.database(source_db_url)
    elsif result == true
      default_docs = CouchDocs::default_docs(self.company_type.name, self.user.email,
                                             I18n.t('widgets.names'))

      # compact to remove deadly nil-related errors. Better to discover later
      # than to tell user "we just died, sorry about that"
      db.bulk_save default_docs.compact, false
    end
    result
  end

  def get_widget_doc(wsubtype,wname=nil)
    rows = CouchRest.database(self.couch_db_url).view('widgets/by_name', {
      :include_docs => true,
      :key => [nil,wsubtype]
    })['rows']

    if wname.nil?
      rows.first && rows.first['doc']
    else
      row = rows.select {|row| row['doc']['name'] == wname}.first
      row['doc']
    end
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
    "http://#{db_name}.yomobi.com"
  end

  def couch_host
    Rails.application.config.couch_host
  end

  def couch_db_url
    ApplicationController::couch_url self.db_name, :@admin
  end

  def settings
    if self.company_settings.nil?
      self.create_company_settings
    end
    self.company_settings
  end

  def premium?
    self.premium == true
  end

  def as_json(options=nil)
    {
      id: self.id,
      name: self.name,
      url: self.db_name,
      logo: self.logo.url(:mobile),
      owner: self.user,
      admins: self.admins
    }
  end

  private

  def check_file_size
    valid?
    errors[:image_file_size].blank?
  end
end
