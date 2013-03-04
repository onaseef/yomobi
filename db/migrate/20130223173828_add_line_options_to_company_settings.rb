class AddLineOptionsToCompanySettings < ActiveRecord::Migration
  def change
    add_column :company_settings, :line_mode_icon_height, :integer, default: 100, null: false
    add_column :company_settings, :line_mode_font_size, :integer, default: 18, null: false
  end
end
