class ChangeCompanyIdCounterToNonNull < ActiveRecord::Migration
  def self.up
    change_column_null :companies, :id_counter, false, 1
  end

  def self.down
    change_column_null :companies, :id_counter, true
  end
end
