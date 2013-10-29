class RequirePaymentExpireDate < ActiveRecord::Migration
  def self.up
    change_column :payments, :expire_date, :date, :null => false
  end

  def self.down
    change_column :payments, :expire_date, :date, :null => true
  end
end
