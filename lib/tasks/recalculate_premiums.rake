

desc 'This recalculates all company premium statuses'
task :recalculate_premiums => :environment do
  puts "Updating all company premium statuses..."
  Company.joins(:payments).select('companies.*').group(:id).each {|c|
    c.recalculate_premium
  }
  puts "done."
end
