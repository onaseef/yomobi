class RemoveFooterFromCompanySettings < ActiveRecord::Migration
  def self.up
    remove_column :company_settings, :footer_color
    remove_column :company_settings, :footer_text_color
  end

  def self.down
    add_column :company_settings, :footer_text_color, :string
    add_column :company_settings, :footer_color, :string
  end
end
