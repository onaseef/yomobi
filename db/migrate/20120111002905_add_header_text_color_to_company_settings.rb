class AddHeaderTextColorToCompanySettings < ActiveRecord::Migration
  def self.up
    add_column :company_settings, :header_text_color, :string
  end

  def self.down
    remove_column :company_settings, :header_text_color
  end
end
