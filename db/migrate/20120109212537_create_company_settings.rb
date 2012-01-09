class CreateCompanySettings < ActiveRecord::Migration
  def self.up
    create_table :company_settings do |t|
      t.references :company
      t.string :header_color

      t.timestamps
    end
  end

  def self.down
    drop_table :company_settings
  end
end
