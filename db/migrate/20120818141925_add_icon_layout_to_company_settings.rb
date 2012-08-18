class AddIconLayoutToCompanySettings < ActiveRecord::Migration
  def self.up
    add_column :company_settings, :icon_layout, :string, :default => 'grid'
  end

  def self.down
    remove_column :company_settings, :icon_layout
  end
end
