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

ActiveRecord::Schema.define(:version => 20120605191037) do

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
    t.text     "keywords",            :limit => 255
    t.string   "call_back_email"
    t.integer  "company_type_id"
    t.integer  "id_counter",                         :default => 1,     :null => false
    t.boolean  "premium",                            :default => false
    t.string   "banner_file_name"
    t.string   "banner_content_type"
    t.integer  "banner_file_size"
    t.datetime "banner_updated_at"
  end

  add_index "companies", ["db_name"], :name => "index_companies_on_db_name", :unique => true

  create_table "company_settings", :force => true do |t|
    t.integer  "company_id"
    t.string   "header_color"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "header_text_color"
    t.string   "slogan"
    t.string   "tab_bar_color"
    t.string   "tab_bar_text_color"
    t.string   "icon_font_family"
    t.string   "icon_text_color"
    t.string   "body_bg_file_name"
    t.string   "body_bg_content_type"
    t.integer  "body_bg_file_size"
    t.datetime "body_bg_updated_at"
    t.string   "body_bg_repeat"
    t.string   "body_bg_color"
    t.string   "header_font_family"
    t.string   "tab_bar_font_family"
    t.string   "banner_size",          :default => "auto"
  end

  create_table "company_types", :force => true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "company_types", ["name"], :name => "index_company_types_on_name", :unique => true

  create_table "domains", :force => true do |t|
    t.integer  "company_id"
    t.string   "host"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "domains", ["host"], :name => "index_domains_on_host", :unique => true

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

  create_table "keys", :force => true do |t|
    t.integer  "user_id"
    t.integer  "company_id"
    t.boolean  "owner"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "payments", :force => true do |t|
    t.integer  "user_id"
    t.integer  "company_id"
    t.integer  "wepay_checkout_record_id"
    t.date     "expire_date"
    t.boolean  "is_valid",                 :default => true
    t.integer  "cents",                    :default => 0,    :null => false
    t.string   "currency"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "sub_state"
  end

  add_index "payments", ["wepay_checkout_record_id"], :name => "index_payments_on_wepay_checkout_record_id", :unique => true

  create_table "signup_keys", :force => true do |t|
    t.integer  "company_id"
    t.string   "key"
    t.boolean  "expired",    :default => false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "user_id"
  end

  add_index "signup_keys", ["key"], :name => "index_signup_keys_on_key", :unique => true

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
    t.integer  "default_company_id"
    t.integer  "active_company_id"
  end

  add_index "users", ["authentication_token"], :name => "index_users_on_authentication_token", :unique => true
  add_index "users", ["email"], :name => "index_users_on_email", :unique => true
  add_index "users", ["reset_password_token"], :name => "index_users_on_reset_password_token", :unique => true

  create_table "wepay_checkout_records", :force => true do |t|
    t.integer  "checkout_id"
    t.integer  "account_id"
    t.string   "state"
    t.string   "short_description"
    t.text     "long_description"
    t.string   "currency"
    t.decimal  "amount"
    t.decimal  "app_fee"
    t.string   "fee_payer"
    t.decimal  "gross"
    t.decimal  "fee"
    t.string   "reference_id"
    t.text     "redirect_uri"
    t.text     "callback_uri"
    t.text     "checkout_uri"
    t.string   "payer_email"
    t.string   "payer_name"
    t.text     "cancel_reason"
    t.text     "refund_reason"
    t.boolean  "auto_capture"
    t.boolean  "require_shipping"
    t.text     "shipping_address"
    t.decimal  "tax"
    t.string   "security_token"
    t.string   "access_token"
    t.string   "mode"
    t.integer  "create_time"
    t.integer  "preapproval_id"
    t.string   "preapproval_uri"
    t.string   "period"
    t.boolean  "auto_recur",        :default => false
    t.integer  "start_time"
    t.integer  "end_time"
    t.integer  "frequency"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "wepay_checkout_records", ["checkout_id"], :name => "index_wepay_checkout_records_on_checkout_id"
  add_index "wepay_checkout_records", ["preapproval_id"], :name => "index_wepay_checkout_records_on_preapproval_id"

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
