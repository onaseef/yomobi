class AddActiveCompanyIdToUser < ActiveRecord::Migration
  def self.up
    add_column :users, :active_company_id, :integer
  end

  def self.down
    remove_column :users, :active_company_id
  end
end
