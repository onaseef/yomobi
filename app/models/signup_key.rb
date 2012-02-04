class SignupKey < ActiveRecord::Base
  belongs_to :company
  # user_id is only set after this key has expired
  belongs_to :user

  attr_readonly :key, :company
  before_create :generate_key

  validates :key, :uniqueness => true

  # Blank; don't allow direct modification of this attribute
  def expire=(_); end;

  def expire!(user_id)
    self.update_attributes :expired => true, :user_id => user_id
  end

  def expired?
    self.expired == true
  end

  def to_s; self.key.to_s; end;
  def as_json(options=nil); self.key.to_s; end

  private

  def generate_key
    self.key = CouchDocs.gen_salt
  end
end
