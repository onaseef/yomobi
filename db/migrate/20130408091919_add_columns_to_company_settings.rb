class AddColumnsToCompanySettings < ActiveRecord::Migration
  def change
  	add_column :company_settings, :tab_bar_visible, :boolean, :default => true
  	add_column :company_settings, :footer_bar_visible, :boolean, :default => true
  end
end
