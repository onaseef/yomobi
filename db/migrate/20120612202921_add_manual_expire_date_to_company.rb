class AddManualExpireDateToCompany < ActiveRecord::Migration
  def self.up
    add_column :companies, :manual_expire_date, :date, :default => Date.new(2012,1,1)
  end

  def self.down
    remove_column :companies, :manual_expire_date
  end
end
