class CreateCompanies < ActiveRecord::Migration
  def self.up
    create_table :companies do |t|
      t.references :user
      t.string :name
      t.string :db_name
      t.string :db_pass

      t.timestamps
    end
  end

  def self.down
    drop_table :companies
  end
end
