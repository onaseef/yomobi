class ChangeCompanyKeywordsToText < ActiveRecord::Migration
  def self.up
    change_column :companies, :keywords, :text, :limit => 65536
  end

  def self.down
    change_column :companies, :keywords, :string
  end
end
