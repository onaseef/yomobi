CarrierWave.configure do |config|

  config.cache_dir = File.join(Rails.root, 'tmp', 'uploads')

  case Rails.env.to_sym

  when :production, :development
    # the following configuration works for Amazon S3
    config.storage          = :fog
    config.fog_credentials  = {
      :provider                 => 'AWS',
      :aws_access_key_id        => ENV['S3_KEY'],
      :aws_secret_access_key    => ENV['S3_SECRET'],
      :region                   => 'us-east-1'
    }
    config.fog_directory    = ENV['LOCO_S3_BUCKET']

  else
    # settings for the local filesystem
    config.storage = :file
    config.root = File.join(Rails.root, 'public')
  end

end
