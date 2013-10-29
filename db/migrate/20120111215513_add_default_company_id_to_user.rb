class AddDefaultCompanyIdToUser < ActiveRecord::Migration
  def self.up
    add_column :users, :default_company_id, :integer
  end

  def self.down
    remove_column :users, :default_company_id
  end
end
