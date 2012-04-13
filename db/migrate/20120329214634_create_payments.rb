class CreatePayments < ActiveRecord::Migration
  def self.up
    create_table :payments do |t|
      t.references :user
      t.references :company
      t.references :wepay_checkout_record
      t.date :expire_date
      t.boolean :is_valid,   :default => true

      t.integer :cents, :default => 0, :null => false
      t.string  :currency

      t.timestamps
    end
    add_index :payments, :wepay_checkout_record_id, :unique => true
  end

  def self.down
    drop_table :payments
  end
end
