class CreateDomains < ActiveRecord::Migration
  def self.up
    create_table :domains do |t|
      t.references :company
      t.string :host

      t.timestamps
    end

    add_index :domains, :host, :unique => true
  end

  def self.down
    drop_table :domains
  end
end
