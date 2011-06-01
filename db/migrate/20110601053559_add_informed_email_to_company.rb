class AddInformedEmailToCompany < ActiveRecord::Migration
  def self.up
    add_column :companies, :informed_email, :string
  end

  def self.down
    remove_column :companies, :informed_email
  end
end
