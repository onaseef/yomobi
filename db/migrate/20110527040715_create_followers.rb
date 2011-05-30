class CreateFollowers < ActiveRecord::Migration
  def self.up
    create_table :followers do |t|
      t.references :company
      t.references :carrier
      t.string :email
      t.string :phone
      t.string :opt_out_key

      t.timestamps
    end
    add_index :followers, :opt_out_key, :unique => true
    add_index :followers, :email, :unique => true
    add_index :followers, :phone, :unique => true
  end

  def self.down
    drop_table :followers
  end
end
