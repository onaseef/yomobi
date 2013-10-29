class AddKeywordsToCompany < ActiveRecord::Migration
  def self.up
    add_column :companies, :keywords, :string
  end

  def self.down
    remove_column :companies, :keywords
  end
end
