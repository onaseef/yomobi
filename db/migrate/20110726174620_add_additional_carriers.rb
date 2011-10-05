class AddAdditionalCarriers < ActiveRecord::Migration
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
      'Cricket' => 'sms.mycricket.com',
      'C Spire' => 'cspire1.com',
      'Metro PCS' => 'mymetropcs.com',
      'Qwest' => 'qwestmp.com',
      'Telus (Canadian)' => 'msg.telus.com',
      'Bell Canada (Canadian)' => 'txt.bellmobility.ca',
      'Rogers (Canadian)' => 'pcs.rogers.com'
    }
  end
end
