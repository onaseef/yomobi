class CompanySettings < ActiveRecord::Base
  belongs_to :company

  validates :header_color, 
            :allow_nil => true,
            :format => { :with => /#[0-9a-f]{3}([0-9a-f]{3})?$/,
                         :message => "Invalid hex format." }
  
  before_validation :format_color, :only => [:header_color]

  private

  def format_color
    self.header_color = nil if self.header_color == ''
    return if self.header_color.nil?
    self.header_color.downcase!
    self.header_color = "\##{self.header_color}" unless self.header_color.match /^#/
  end
end
