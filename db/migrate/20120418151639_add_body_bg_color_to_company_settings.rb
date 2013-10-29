class AddBodyBgColorToCompanySettings < ActiveRecord::Migration
  def self.up
    add_column :company_settings, :body_bg_color, :string
  end

  def self.down
    remove_column :company_settings, :body_bg_color
  end
end
