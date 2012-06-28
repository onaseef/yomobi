class AddCustomizeAttrsToCompanySettings < ActiveRecord::Migration
  def self.up
    add_column :company_settings, :tab_bar_color, :string
    add_column :company_settings, :tab_bar_text_color, :string
    add_column :company_settings, :icon_font_family, :string
    add_column :company_settings, :icon_text_color, :string
    add_column :company_settings, :footer_color, :string
    add_column :company_settings, :footer_text_color, :string
  end

  def self.down
    remove_column :company_settings, :tab_bar_color
    remove_column :company_settings, :tab_bar_text_color
    remove_column :company_settings, :icon_font_family
    remove_column :company_settings, :icon_text_color
    remove_column :company_settings, :footer_color
    remove_column :company_settings, :footer_text_color
  end
end
