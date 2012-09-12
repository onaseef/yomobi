class AddIconLineHeightToCompanySettings < ActiveRecord::Migration
  def self.up
    add_column :company_settings, :icon_line_height, :integer, :default => 100
  end

  def self.down
    remove_column :company_settings, :icon_line_height
  end
end
