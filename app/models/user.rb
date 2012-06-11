class User < ActiveRecord::Base
  has_many :companies
  has_many :keys, :dependent => :delete_all
  has_many :shared_companies, :through => :keys, :source => :company
  has_many :payments

  # only used for analytics purposes
  has_many :signup_keys, :dependent => :delete_all
  
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable, :lockable and :timeoutable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable,
         :confirmable, :token_authenticatable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me, :company_type_id,
                  :first_name, :last_name, :default_company_id, :active_company_id

  validates_presence_of :first_name, :last_name

  before_validation :clean_email, :only => [:email]
  before_save :clean_email

  def self.find_for_authentication(conditions)
    unless conditions[:email].nil?
      conditions[:email].downcase!
      conditions[:email].strip!
    end
    super(conditions)
  end

  def charge_history
    payments = self.payments
      .joins(:wepay_checkout_record).includes(:wepay_checkout_record)
      .includes(:company)
      .where(:is_valid => true)
      .where('wepay_checkout_records.start_time <= :start_time',
              :start_time => (Time.now + 3.hours).to_i)
      .order('wepay_checkout_records.start_time')
    history = []
    payments.each do |p|
      history << p.charge_history.map {|date| Charge.new(p,date) }
    end
    history.flatten!.sort_by! { |charge| charge.charge_date }
  end

  # returns the company that the user is currently editing
  def company
    co = Company.find_by_id self.active_company_id
    if co.nil?
      co = self.all_companies.last
      (self.active_company_id = co.id) && save unless co.nil?
    end
    co
  end

  def default_company
    co = Company.find_by_id self.default_company_id
    if co.nil?
      co = self.all_companies.first
      (self.default_company_id = co.id) && save unless co.nil?
    end
    co
  end

  def all_companies
    self.companies + self.shared_companies
  end

  def can_access_company?(co)
    return false if co.nil?
    self == co.user || Key.exists?(:user_id => self.id, :company_id => co.id)
  end

  def as_json(options=nil)
    {
      id: self.id,
      email: self.email,
      firstName: self.first_name,
      lastName: self.last_name,
      logo: self.default_company.logo.url(:mobile)
    }
  end

  private

  def clean_email
    self.email = self.email.downcase.strip if self.email
  end
end
