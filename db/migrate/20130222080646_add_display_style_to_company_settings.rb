class AddDisplayStyleToCompanySettings < ActiveRecord::Migration
  def change
    add_column :company_settings, :display_style, :string, default: 'icon', null: false
  end
end
