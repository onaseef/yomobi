class AddSloganToCompanySettings < ActiveRecord::Migration
  def self.up
    add_column :company_settings, :slogan, :string
  end

  def self.down
    remove_column :company_settings, :slogan
  end
end
