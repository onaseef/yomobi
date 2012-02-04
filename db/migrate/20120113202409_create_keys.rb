class CreateKeys < ActiveRecord::Migration
  def self.up
    create_table :keys do |t|
      t.references :user
      t.references :company
      t.boolean :owner

      t.timestamps
    end
  end

  def self.down
    drop_table :keys
  end
end
