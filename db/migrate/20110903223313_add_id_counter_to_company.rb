class AddIdCounterToCompany < ActiveRecord::Migration
  def self.up
    add_column :companies, :id_counter, :integer, :default => 1
  end

  def self.down
    remove_column :companies, :id_counter
  end
end
