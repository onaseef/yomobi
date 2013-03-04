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

  validates :display_style, :presence => true, :inclusion => { :in => %w(icon line) }
  def in_line_mode?
    display_style == 'line'
  end
  validates :line_mode_icon_height, :presence => true, :numericality => true
  validates :line_mode_font_size, :presence => true, :numericality => true

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

  def self.line_mode_icon_heights
    [100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0].freeze
  end

  def self.line_mode_font_sizes
    [18, 17, 16, 15, 14, 13, 12, 11, 10].freeze
  end

  def line_mode_line_height
    max_height = 57
    height = max_height * line_mode_icon_height / 100
    height > line_mode_font_size ? height : line_mode_font_size
  end

  def invalid_icon_height
    max_icon_height = 32
    max_icon_height * line_mode_icon_height / 100
  end

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
      display_style: self.display_style,
      line_mode_icon_height: self.line_mode_icon_height,
      line_mode_font_size: self.line_mode_font_size,
    }
  end

  def attributes_from_params=(params)
    self.header_color = params[:header_color]
    self.header_text_color = params[:header_text_color]
    self.header_font_family = params[:header_font_family]

    self.banner_size = params[:banner_size]

    self.tab_bar_color = params[:tab_bar_color]
    self.tab_bar_text_color = params[:tab_bar_text_color]
    self.tab_bar_font_family = params[:tab_bar_font_family]

    self.icon_text_color = params[:icon_text_color]
    self.icon_font_family = params[:icon_font_family]

    self.body_bg_repeat = params[:body_bg_repeat]
    self.body_bg_color = params[:body_bg_color]
    
    self.display_style = params[:display_style]
    self.line_mode_icon_height = params[:line_mode_icon_height]
    self.line_mode_font_size = params[:line_mode_font_size]
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
