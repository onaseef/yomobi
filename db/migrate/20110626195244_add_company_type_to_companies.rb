class AddCompanyTypeToCompanies < ActiveRecord::Migration
  def self.up
    change_table :companies do |t|
      t.references :company_type
    end
  end

  def self.down
    remove_column :companies, :company_type_id
  end
end
