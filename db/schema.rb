# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20120131203333) do

  create_table "carriers", :force => true do |t|
    t.string   "name"
    t.string   "text_email"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "carriers", ["name"], :name => "index_carriers_on_name", :unique => true

  create_table "companies", :force => true do |t|
    t.integer  "user_id"
    t.string   "name"
    t.string   "db_name"
    t.string   "db_pass"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "logo_file_name"
    t.string   "logo_content_type"
    t.integer  "logo_file_size"
    t.datetime "logo_updated_at"
    t.string   "informed_email"
    t.string   "leave_msg_email"
    t.string   "booking_email"
    t.text     "keywords",          :limit => 255
    t.string   "call_back_email"
    t.integer  "company_type_id"
    t.integer  "id_counter",                       :default => 1,     :null => false
    t.boolean  "premium",                          :default => false
  end

  add_index "companies", ["db_name"], :name => "index_companies_on_db_name", :unique => true

  create_table "company_settings", :force => true do |t|
    t.integer  "company_id"
    t.string   "header_color"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "header_text_color"
    t.string   "slogan"
  end

  create_table "company_types", :force => true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "company_types", ["name"], :name => "index_company_types_on_name", :unique => true

  create_table "followers", :force => true do |t|
    t.integer  "company_id"
    t.integer  "carrier_id"
    t.string   "email"
    t.string   "phone"
    t.string   "opt_out_key"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "short_url"
    t.boolean  "active",      :default => true
  end

  add_index "followers", ["email", "company_id"], :name => "index_followers_on_email_and_company_id", :unique => true
  add_index "followers", ["opt_out_key"], :name => "index_followers_on_opt_out_key", :unique => true
  add_index "followers", ["phone", "company_id"], :name => "index_followers_on_phone_and_company_id", :unique => true

  create_table "sigs", :force => true do |t|
    t.string   "email"
    t.integer  "type"
    t.string   "delete_hash"
    t.text     "custom"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", :force => true do |t|
    t.string   "email",                               :default => "", :null => false
    t.string   "encrypted_password",   :limit => 128, :default => "", :null => false
    t.string   "reset_password_token"
    t.string   "remember_token"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",                       :default => 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.string   "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "company_type_id"
    t.string   "first_name"
    t.string   "last_name"
    t.string   "authentication_token"
  end

  add_index "users", ["authentication_token"], :name => "index_users_on_authentication_token", :unique => true
  add_index "users", ["email"], :name => "index_users_on_email", :unique => true
  add_index "users", ["reset_password_token"], :name => "index_users_on_reset_password_token", :unique => true

  create_table "wphotos", :force => true do |t|
    t.string   "wid"
    t.string   "photo_file_name"
    t.string   "photo_content_type"
    t.integer  "photo_file_size"
    t.datetime "photo_updated_at"
    t.integer  "company_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
