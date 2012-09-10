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
  has_many :payments
  has_many :domains

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

  # See: http://www.imagemagick.org/Usage/resize/
  has_attached_file :banner,
    :styles => {
      :mobile => "320x3200>",
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

  def mobile_url_share
    "http://www.yomobi.com/#{db_name}"
  end

  def url_and_name
    "[/#{db_name}] #{name}"
  end

  def site_name
    "#{name}"
  end

  def site_url
    "/#{db_name}"
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

  def last_payment(bust_cache=false)
    if @last_payment.nil? || bust_cache == true
      @last_payment = Payment.most_recent_for_company(self)
    end
    @last_payment
  end

  def last_subscription(exception=nil)
    exception_id = exception.wcr.preapproval_id if exception && exception.wcr
    wcr = WepayCheckoutRecord.last_preapproval_for_company(self, exception_id)
    wcr && wcr.payment
  end

  def expire_date(bust_cache=false)
    payment = self.last_payment(bust_cache)
    [payment && payment.expire_date, self.manual_expire_date].compact.max
  end

  def hard_expire_date
    payment = self.last_payment(true)
    expire_date = payment && (payment.wcr.preapproval_id ? payment.next_charge_date : payment.expire_date)
    expire_date = Date.today if payment && payment.wcr.start_time > Time.now.to_i
    [expire_date, self.manual_expire_date].compact.max
  end

  def recalculate_premium
    expire_date = self.expire_date(true)
    if expire_date.nil?
      self.update_attribute :premium, false
    else
      self.update_attribute :premium, expire_date > DateTime.now
    end
  end

  def subscription_end_date
    payment = self.last_payment
    record = payment && payment.wepay_checkout_record
    if record && record.state && record.state != 'cancelled' && record.end_time
      Time.at(record.end_time).to_date
    end
  end

  def subscription_type
    payment = self.last_payment
    record = payment && payment.wepay_checkout_record
    record && record.period
  end

  def next_charge_date
    last_sub = self.last_subscription
    return nil if last_sub.nil?
    last_sub.next_charge_date
  end

  def as_json(options=nil)
    {
      id: self.id,
      name: self.name,
      url: self.db_name,
      logo: self.logo.url(:mobile),
      owner: self.user,
      admins: self.admins,
      domains: self.domains,
      isPremium: self.premium?,
      testUser: self.user.test_user?,
      expireDate: (self.expire_date.strftime I18n.t 'date_formats.site_grade_dates' if self.expire_date),
      nextChargeDate: (self.next_charge_date.strftime I18n.t 'date_formats.site_grade_dates' if self.next_charge_date),
      subscriptionEndDate: (self.subscription_end_date.strftime I18n.t 'date_formats.site_grade_dates' if self.subscription_end_date),
      subscriptionType: self.subscription_type,
    }
  end

  private

  def check_file_size
    valid?
    errors[:image_file_size].blank?
  end
end
