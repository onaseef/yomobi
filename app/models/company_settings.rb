class CompanySettings < ActiveRecord::Base
  belongs_to :company

  validates :header_color, :header_text_color,
            :tab_bar_color, :tab_bar_text_color,
            :icon_text_color,
            :footer_color, :footer_text_color,
            :allow_nil => true,
            :format => { :with => /#[0-9a-f]{3}([0-9a-f]{3})?$/,
                         :message => "Invalid hex format." }

  validates :slogan,
            :allow_nil => true,
            :length => { :maximum => MAX_COMPANY_SLOGAN_LENGTH }

  before_validation :format_color

  def as_json(options=nil)
    {
      slogan: self.slogan,
      header_color: self.header_color,
      header_text_color: self.header_text_color,
      tab_bar_color: self.tab_bar_color,
      tab_bar_text_color: self.tab_bar_text_color,
      icon_font_family: self.icon_font_family,
      icon_text_color: self.icon_text_color,
      footer_color: self.footer_color,
      footer_text_color: self.footer_text_color,
    }
  end

  private

  def format_color
    [:header_color, :header_text_color, :tab_bar_color, :tab_bar_text_color,
      :icon_text_color, :footer_color, :footer_text_color].each do |color|

      send "#{color}=", nil if send(color) == ''
      next if send(color).nil?
      send(color).downcase!
      send "#{color}=", "\##{send color}" unless send(color).match /^#/
    end
    true
  end
end
