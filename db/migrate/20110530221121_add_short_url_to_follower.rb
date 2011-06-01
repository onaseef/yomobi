class AddShortUrlToFollower < ActiveRecord::Migration
  def self.up
    add_column :followers, :short_url, :string
  end

  def self.down
    remove_column :followers, :short_url
  end
end
