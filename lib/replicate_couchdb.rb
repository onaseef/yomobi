#!/usr/bin/env ruby
 
require 'optparse'
require 'rubygems'
require 'json'
 
options = {}
data = {}

optparse = OptionParser.new do |opts|
  # Banner that displays at top of help screen
  opts.banner = "Usage: replicate [options] source target"
  
  # Define the options and what they do
  options[:verbose] = false
  opts.on('-v', '--verbose', 'Output response from CouchDB') do
    options[:verbose] = true
  end
  
  options[:continuous] = false
  opts.on('-c', '--continuous', 'Continuous replication') do
    data[:continuous] = true
  end
  
  opts.on('-h', '--help', 'Display this screen') do
    puts opts
    exit
  end
 
end
 
# Parse the command line arguments
# parse! removes the options
optparse.parse!
 
# Handle the ARGVs
#data[:source] = ARGV[0]
#data[:target] = ARGV[1]
 
dbStr = %x[curl --silent https://dbadmin:dbAdm1n4Ym@yomobi.iriscouch.com/_all_dbs]
dbStr = dbStr.gsub(/[\[\]\"]/, '')
dbStr = dbStr.gsub('_replicator', '')
dbArr = dbStr.split(",")

i = 0
data[:create_target] = true
dbArr.each do | db |
  data[:source] = "https://dbadmin:dbAdm1n4Ym@yomobi.iriscouch.com/" + db
  data[:target] = "https://yomobi:cl0wdANTy0mOb1@yomobi.cloudant.com/" + db
  i += 1
  if i > 10
    break
  end
  print "============================================\n"
  print data.to_json + "\n" 
  print "============================================\n"
  %x[curl -X POST http://dbadmin:dbAdm1n4Ym@yomobi.iriscouch.com/_replicator -H 'Content-Type: application/json' -d '#{data.to_json}']
end

# Need to figure out how to handle the result. Even if CouchDB returns {"ok":true}
# replication can still fail.
#result = %x[curl --silent -X POST http://127.0.0.1:5984/_replicate -d '#{data.to_json}']