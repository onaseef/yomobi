class Follower < ActiveRecord::Base
  belongs_to :company
  belongs_to :carrier

  before_validation :handle_empty_values



  validates_as_email_address :email, :on => :create, :allow_nil => true
  validates_length_of :phone, :is => 10, :allow_nil => true, :message => 'is not valid'

  validates_uniqueness_of :email, :scope => [:company_id], :allow_nil => true
  validates_uniqueness_of :phone, :scope => [:company_id], :allow_nil => true

  def save_new
    begin
      save    
    rescue ActiveRecord::StatementInvalid => error
      if DUPLICATE_ERROR_MESSAGES.any? { |msg| error.message =~ /#{Regexp.escape(msg)}/i }
        logger.info "Duplicate Entry exception from DB\n====\n#{error.message}\n===="
        errors.add(:base,'Duplicate item in database level')
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

  def send_email(subject,content)
    return if email.nil?
    puts "Sending email to #{email} (subject=#{subject})"
    UserMailer.email_follower({
      :short_url => short_url,
      :company_name => company.name,
      :to => email,
      :from => company.informed_email,
      :subject => subject,
      :content => content
    }).deliver
  end

  private

  def handle_empty_values
    self.phone.gsub! /[^0-9]+/, '' if phone
    (self.phone = nil) && (self.carrier = nil) if !phone.present? || !carrier.present?
    self.email = nil if !email.present?
    self.opt_out_key, self.short_url = new_opt_out_pair if opt_out_key.nil?
    true
  end

  def new_opt_out_pair
    key = Digest::SHA1.hexdigest("#{email}#{phone}#{company[:id]}yomobi-salt")

    url = "#{Rails.application.config.opt_out_url_host}/opt-out/#{key}"
    api_key = ENV['GOOGLE_API_KEY']
    short_url = Shortly::Clients::Googl.shorten(url, :apiKey => api_key).shortUrl
    puts "SHORT URL: #{short_url}"
    [key,short_url]
  end

end
