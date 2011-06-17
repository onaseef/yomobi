class AddCallBackEmailToCompany < ActiveRecord::Migration
  def self.up
    add_column :companies, :call_back_email, :string
  end

  def self.down
    remove_column :companies, :call_back_email
  end
end
