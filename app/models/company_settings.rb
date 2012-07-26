class CompanySettings < ActiveRecord::Base
  belongs_to :company

  validates :header_color, :header_text_color,
            :tab_bar_color, :tab_bar_text_color,
            :body_bg_color,
            :icon_text_color,
            :allow_nil => true,
            :format => { :with => /#[0-9a-f]{3}([0-9a-f]{3})?$/,
                         :message => "Invalid hex format." }

  validates :slogan,
            :allow_nil => true,
            :length => { :maximum => MAX_COMPANY_SLOGAN_LENGTH }

  before_validation :format_color
 
  # See: http://www.imagemagick.org/Usage/resize/
  has_attached_file :body_bg,
    :styles => {
      :mobile => "320x3200>",
      :original => "1x1#"
    },
    :default_url => '',
    :storage => :s3,
    :bucket => Rails.application.config.logo_s3_bucket,
    :path => 'body_bgs/:id_:style',
    :s3_credentials => {
      :access_key_id => ENV['S3_KEY'],
      :secret_access_key => ENV['S3_SECRET']
    }

  def as_json(options=nil)
    {
      slogan: self.slogan,
      header_color: self.header_color,
      header_text_color: self.header_text_color,
      header_font_family: self.header_font_family,
      banner_size: self.banner_size,
      tab_bar_color: self.tab_bar_color,
      tab_bar_text_color: self.tab_bar_text_color,
      tab_bar_font_family: self.tab_bar_font_family,
      icon_font_family: self.icon_font_family,
      icon_text_color: self.icon_text_color,
      body_bg_repeat: self.body_bg_repeat,
      body_bg_color: self.body_bg_color,
    }
  end

  private

  def format_color
    [:header_color, :header_text_color, :tab_bar_color, :tab_bar_text_color,
     :body_bg_color, :icon_text_color].each do |color|

      send "#{color}=", nil if send(color) == ''
      next if send(color).nil?
      send(color).downcase!
      send "#{color}=", "\##{send color}" unless send(color).match /^#/
    end
    true
  end
end
