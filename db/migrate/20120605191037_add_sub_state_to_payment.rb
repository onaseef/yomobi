class AddSubStateToPayment < ActiveRecord::Migration
  def self.up
    add_column :payments, :sub_state, :string
  end

  def self.down
    remove_column :payments, :sub_state
  end
end
