class CreateCompanies < ActiveRecord::Migration
  def self.up
    create_table :companies do |t|
      t.references :user
      t.string :name
      t.string :db_name
      t.string :db_pass

      t.timestamps
    end
    add_index :companies, :db_name, :unique => true
  end

  def self.down
    drop_table :companies
  end
end
