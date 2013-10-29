class AddBannerSizeToCompanySettings < ActiveRecord::Migration
  def self.up
    add_column :company_settings, :banner_size, :string, :default => 'auto'
  end

  def self.down
    remove_column :company_settings, :banner_size
  end
end
