class Domain < ActiveRecord::Base
  belongs_to :company

  validates :host,
            :uniqueness => true,
            :format => { :with => /^[a-z0-9]+(\.[a-z0-9]+)*\.[a-z]{2,6}$/,
                         :message => "Invalid host format." }

  before_validation :format_host

  def as_json(options=nil)
    {
      id: self.id,
      host: self.host
    }
  end

  private

  def format_host
    self.host = self.host.downcase
  end

end
