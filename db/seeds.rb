# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ :name => 'Chicago' }, { :name => 'Copenhagen' }])
#   Mayor.create(:name => 'Daley', :city => cities.first)

bob = User.create! \
  :email => 'bob@gmail.com',
  :password => '123123',
  :password_confirmation => '123123',
  :company_type_id => 2

bob.update_attribute(:confirmed_at, DateTime.new)
puts "Created User: #{bob.inspect}"

bob.companies.create \
  :name => 'Chipotle!',
  :db_name => 'chipotle',
  :db_pass => 'n0n-_-exist@nt??'

puts "Created Company: #{bob.company.inspect}"
