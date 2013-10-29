class CreateCarriers < ActiveRecord::Migration
  def self.up
    create_table :carriers do |t|
      t.string :name
      t.string :text_email

      t.timestamps
    end
    add_index :carriers, :name, :unique => true

    # Populate table
    Carrier.reset_column_information
    {
      'Alltel' => 'message.alltel.com',
      'AT&T' => 'txt.att.net',
      'Boost Mobile' => 'myboostmobile.com',
      'Nextel' => 'messaging.nextel.com',
      'Sprint PCS' => 'messaging.sprintpcs.com',
      'T-Mobile' => 'tmomail.net',
      'US Cellular' => 'email.uscc.net',
      'Verizon' => 'vtext.com',
      'Virgin Mobile USA' => 'vmobl.com'
    }.each do |carrier,email|
      Carrier.create :name => carrier, :text_email => email
    end
  end

  def self.down
    drop_table :carriers
  end
end
