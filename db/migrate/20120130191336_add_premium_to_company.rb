class AddPremiumToCompany < ActiveRecord::Migration
  def self.up
    add_column :companies, :premium, :boolean, :default => false
  end

  def self.down
    remove_column :companies, :premium
  end
end
