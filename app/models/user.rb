class User < ActiveRecord::Base
  has_one :company
  
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable, :lockable and :timeoutable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable,
         :confirmable, :token_authenticatable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me, :company_type_id,
                  :first_name, :last_name

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

  private

  def clean_email
    self.email = self.email.downcase.strip if self.email
  end
end
