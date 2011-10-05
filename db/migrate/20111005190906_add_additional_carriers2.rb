class AddAdditionalCarriers2 < ActiveRecord::Migration
  def self.up
    Carrier.reset_column_information
    self.carriers.each do |carrier,email|
      Carrier.create :name => carrier, :text_email => email
    end
  end

  def self.down
    self.carriers.each do |carrier,email|
      Carrier.where(:name => carrier, :text_email => email).first.delete
    end
  end

  def self.carriers
    {
      'C Spire' => 'cspire1.com'
    }
  end
end
