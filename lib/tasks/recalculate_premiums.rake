

desc 'This recalculates all company premium statuses'
task :recalculate_premiums => :environment do
  puts "Updating all company premium statuses..."
  cols = Company.column_names.collect {|c| "companies.#{c}"}.join(",")
  Company.joins(:payments).select('companies.*').group(cols).each {|c|
    c.recalculate_premium
  }
  puts "done."
end
