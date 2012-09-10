desc "Remove all test accounts that have been registered for more than 24 hours ago"
task  clean_test_drive: :environment do
  puts "Removing all test drive accounts..."
  User.where("is_test = true AND created_at < ?", 24.hours.ago).each do |user|
    user.companies.destroy_all
    user.delete
  end
end
