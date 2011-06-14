class AddActiveToFollowers < ActiveRecord::Migration
  def self.up
    add_column :followers, :active, :boolean, :default => true
  end

  def self.down
    remove_column :followers, :active
  end
end
