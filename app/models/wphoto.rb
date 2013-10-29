class Wphoto < ActiveRecord::Base
  belongs_to :company

  # See: http://www.imagemagick.org/Usage/resize/
  has_attached_file :photo,
    :styles => {
      :thumb => "70x80>",
      :original => "300x3000>",
      :icon => "57x57#"
    },
    :convert_options => {
      :thumb => "-quality 75 -strip", 
      :icon => "-quality 75 -strip" 
    },
    :storage => :s3,
    :bucket => Rails.application.config.logo_s3_bucket,
    :path => 'wphotos/:id-:style',
    :s3_credentials => {
      :access_key_id => ENV['S3_KEY'],
      :secret_access_key => ENV['S3_SECRET']
    }

end
