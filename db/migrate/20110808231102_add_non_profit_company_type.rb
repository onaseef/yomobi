class AddNonProfitCompanyType < ActiveRecord::Migration
  def self.up
    CompanyType.create :name => 'Non-Profit Organization'
  end

  def self.down
  end
end
