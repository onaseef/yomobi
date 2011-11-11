class CreateWphotos < ActiveRecord::Migration
  def self.up
    create_table :wphotos do |t|
      t.string :wid
      t.string :photo_file_name
      t.string :photo_content_type
      t.integer :photo_file_size
      t.datetime :photo_updated_at
      t.references :company

      t.timestamps
    end
  end

  def self.down
    drop_table :wphotos
  end
end
