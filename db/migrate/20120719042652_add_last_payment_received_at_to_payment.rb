class AddLastPaymentReceivedAtToPayment < ActiveRecord::Migration
  def self.up
    add_column :payments, :last_payment_received_at, :date
  end

  def self.down
    remove_column :payments, :last_payment_received_at
  end
end
