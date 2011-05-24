class AddBusinessTypeToUsers < ActiveRecord::Migration
  def self.up
    add_column :users, :business_type, :string
  end

  def self.down
    remove_column :users, :business_type
  end
end
