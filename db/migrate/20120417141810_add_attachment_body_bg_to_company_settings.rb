class AddAttachmentBodyBgToCompanySettings < ActiveRecord::Migration
  def self.up
    add_column :company_settings, :body_bg_file_name, :string
    add_column :company_settings, :body_bg_content_type, :string
    add_column :company_settings, :body_bg_file_size, :integer
    add_column :company_settings, :body_bg_updated_at, :datetime

    add_column :company_settings, :body_bg_repeat, :string
  end

  def self.down
    remove_column :company_settings, :body_bg_file_name
    remove_column :company_settings, :body_bg_content_type
    remove_column :company_settings, :body_bg_file_size
    remove_column :company_settings, :body_bg_updated_at
    remove_column :company_settings, :body_bg_repeat
  end
end
