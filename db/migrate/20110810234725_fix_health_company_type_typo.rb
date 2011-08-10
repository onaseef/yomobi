class FixHealthCompanyTypeTypo < ActiveRecord::Migration
  def self.up
    ctype = CompanyType.where(:name => 'Heath / Medical / Pharmacy').first
    ctype.update_attribute :name, 'Health / Medical / Pharmacy' unless ctype.nil?
  end

  def self.down
  end
end
