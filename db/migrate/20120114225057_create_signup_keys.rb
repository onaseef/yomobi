class CreateSignupKeys < ActiveRecord::Migration
  def self.up
    create_table :signup_keys do |t|
      t.references  :company
      t.string      :key
      t.boolean     :expired, :default => false

      t.timestamps
    end
  end

  def self.down
    drop_table :signup_keys
  end
end
