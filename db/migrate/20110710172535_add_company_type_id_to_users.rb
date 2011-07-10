class AddCompanyTypeIdToUsers < ActiveRecord::Migration
  def self.up
    add_column :users, :company_type_id, :integer
    remove_column :users, :business_type
  end

  def self.down
    add_column :users, :business_type, :string
    remove_column :users, :company_type_id
  end
end
