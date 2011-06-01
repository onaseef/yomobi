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

  def send_text(message)
    return if phone.nil? || carrier.nil?
    puts "Sending text to #{phone} (#{carrier})"
    puts UserMailer.send_text({
      :follower => self,
      :company => company,
      :content => message
    }).deliver
  end

  private

  def handle_empty_values
    @phone.gsub! /[^0-9]+/, ''
    (@phone = nil) && (@carrier = nil) if !phone.present? || !carrier.present?
    @email = nil if !email.present?
    @opt_out_key, @short_url = new_opt_out_pair if opt_out_key.nil?
    true
  end

  def new_opt_out_pair
    key = Digest::SHA1.hexdigest((email || phone) + "yomobi-salt")

    url = "#{Rails.application.config.opt_out_url_host}/opt-out/#{key}"
    api_key = ENV['GOOGLE_API_KEY']
    short_url = Shortly::Clients::Googl.shorten(url, :apiKey => api_key).shortUrl
    puts "SHORT URL: #{short_url}"
    [key,short_url]
  end

end
