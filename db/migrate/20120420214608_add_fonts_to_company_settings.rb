class AddFontsToCompanySettings < ActiveRecord::Migration
  def self.up
    add_column :company_settings, :header_font_family, :string
    add_column :company_settings, :tab_bar_font_family, :string
  end

  def self.down
    remove_column :company_settings, :tab_bar_font_family
    remove_column :company_settings, :header_font_family
  end
end
