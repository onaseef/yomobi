class SignupKey < ActiveRecord::Base
  belongs_to :company

  attr_readonly :key, :company
  before_create :generate_key

  def expire!
    self.update_attribute :expired, true
  end

  def to_s; self.key.to_s; end;
  def as_json(options=nil); self.key.to_s; end

  private

  def generate_key
    self.key = CouchDocs.gen_salt
  end
end
