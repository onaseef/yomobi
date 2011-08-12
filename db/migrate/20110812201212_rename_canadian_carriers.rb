class RenameCanadianCarriers < ActiveRecord::Migration
  def self.up
    {
      'Telus (Canadian)' => 'Telus',
      'Bell Canada (Canadian)' => 'Bell Canada',
      'Rogers (Canadian)' => 'Rogers'
    }.each do |from,to|
      carrier = Carrier.where(:name => from).first
      carrier.update_attribute(:name, to) unless carrier.nil?
    end
  end

  def self.down
  end
end
