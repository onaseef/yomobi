class User < ActiveRecord::Base
  has_many :companies
  
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

  # returns the company that the user is currently editing
  def company
    co = Company.find_by_id self.active_company_id
    if co.nil?
      co = self.companies.last
      (self.active_company_id = co.id) && save unless co.nil?
    end
    co
  end

  def default_company
    co = Company.find_by_id self.default_company_id
    if co.nil?
      co = self.companies.first
      (self.default_company_id = co.id) && save unless co.nil?
    end
    co
  end

  def as_json(options=nil)
    {
      id: self.id,
      email: self.email,
      firstName: self.first_name,
      lastName: self.last_name
    }
  end

  private

  def clean_email
    self.email = self.email.downcase.strip if self.email
  end
end
