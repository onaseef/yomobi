class AddLeaveMsgEmailToCompany < ActiveRecord::Migration
  def self.up
    add_column :companies, :leave_msg_email, :string
  end

  def self.down
    remove_column :companies, :leave_msg_email
  end
end
