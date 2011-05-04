class CreateSigs < ActiveRecord::Migration
  def self.up
    create_table :sigs do |t|
      t.string :email
      t.integer :type
      t.string :delete_hash
      t.text :custom

      t.timestamps
    end
  end

  def self.down
    drop_table :sigs
  end
end
