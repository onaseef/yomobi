class Follower < ActiveRecord::Base
  belongs_to :company
  belongs_to :carrier

  before_validation :handle_empty_values

  validates_as_email_address :email, :on => :create, :unless => Proc.new { self.email.nil? }
  validates_length_of :phone, :is => 10
  validates_uniqueness_of :email, :unless => Proc.new { self.email.nil? }
  validates_uniqueness_of :phone, :unless => Proc.new { self.phone.nil? }

  def save_new
    begin
      save    
    rescue ActiveRecord::StatementInvalid => error
      if DUPLICATE_ERROR_MESSAGES.any? { |msg| error.message =~ /#{Regexp.escape(msg)}/i }
        logger.info "Duplicate Entry exception from DB"
        errors.add_to_base('Duplicate item in database level')
        return false
      else
        raise
      end
    end
  end

  def phone=(new_val)
    self[:phone] = new_val.present? ? new_val : nil
  end

  def email=(new_val)
    self[:email] = new_val.present? ? new_val : nil
  end

  private

  def handle_empty_values
    self.phone.gsub! /[^0-9]+/, ''
    (self.phone = nil) && (self.carrier = nil) if !phone.present? || !carrier.present?
    self.email = nil if !email.present?
    opt_out_key ||= new_opt_out_key
    true
  end

  def new_opt_out_key
    Digest::SHA1.hexdigest((email || phone) + "yomobi-salt")
  end

end
