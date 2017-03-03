# encoding: UTF-8
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

ActiveRecord::Schema.define(:version => 20170303172601) do

  create_table "categories", :force => true do |t|
    t.string   "name"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "compositions", :force => true do |t|
    t.string   "name"
    t.text     "description"
    t.string   "voicing"
    t.string   "sheet_music_file"
    t.string   "recording_file"
    t.datetime "created_at",       :null => false
    t.datetime "updated_at",       :null => false
    t.string   "composer"
    t.string   "lyricist"
    t.string   "category"
    t.boolean  "published"
    t.string   "arranger"
    t.string   "category_text"
    t.string   "voicing_text"
    t.string   "performer"
  end

  create_table "uploaded_files", :force => true do |t|
    t.string   "filename"
    t.binary   "data"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
    t.string   "extension"
  end

  create_table "users", :force => true do |t|
    t.string   "name"
    t.string   "email"
    t.string   "encrypted_password"
    t.datetime "created_at",         :null => false
    t.datetime "updated_at",         :null => false
    t.boolean  "admin"
    t.string   "persistence_token"
    t.string   "salt"
  end

  create_table "voicings", :force => true do |t|
    t.string   "name"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

end
