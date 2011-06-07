class AddBookingEmailToCompany < ActiveRecord::Migration
  def self.up
    add_column :companies, :booking_email, :string
  end

  def self.down
    remove_column :companies, :booking_email
  end
end
