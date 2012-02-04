class AddIndexAndUserToSignupKey < ActiveRecord::Migration
  def self.up
    add_index :signup_keys, :key, :unique => true
    add_column :signup_keys, :user_id, :integer
  end

  def self.down
    add_index :signup_keys, :key
  end
end
