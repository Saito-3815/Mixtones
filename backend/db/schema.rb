# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2024_06_06_065153) do
  create_table "checks", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "tune_id", null: false
    t.boolean "active"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["tune_id"], name: "index_checks_on_tune_id"
    t.index ["user_id", "tune_id"], name: "index_checks_on_user_id_and_tune_id", unique: true
    t.index ["user_id"], name: "index_checks_on_user_id"
  end

  create_table "comments", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "community_id", null: false
    t.bigint "tune_id", null: false
    t.text "body", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["community_id"], name: "index_comments_on_community_id"
    t.index ["tune_id"], name: "index_comments_on_tune_id"
    t.index ["user_id"], name: "index_comments_on_user_id"
  end

  create_table "communities", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name", limit: 40, null: false
    t.text "introduction", size: :tiny
    t.string "avatar"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "playlist_name"
  end

  create_table "likes", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "tune_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["tune_id"], name: "index_likes_on_tune_id"
    t.index ["user_id", "tune_id"], name: "index_likes_on_user_id_and_tune_id", unique: true
    t.index ["user_id"], name: "index_likes_on_user_id"
  end

  create_table "memberships", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "community_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["community_id"], name: "index_memberships_on_community_id"
    t.index ["user_id", "community_id"], name: "index_memberships_on_user_id_and_community_id", unique: true
    t.index ["user_id"], name: "index_memberships_on_user_id"
  end

  create_table "playlists", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "community_id", null: false
    t.bigint "tune_id", null: false
    t.boolean "active"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["community_id", "tune_id"], name: "index_playlists_on_community_id_and_tune_id", unique: true
    t.index ["community_id"], name: "index_playlists_on_community_id"
    t.index ["tune_id"], name: "index_playlists_on_tune_id"
  end

  create_table "tunes", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name", null: false
    t.string "artist", null: false
    t.string "album", null: false
    t.string "images", null: false
    t.string "spotify_uri", null: false
    t.string "preview_url"
    t.string "added_at", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["spotify_uri"], name: "index_tunes_on_spotify_uri", unique: true
  end

  create_table "users", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name", limit: 40, null: false
    t.text "introduction", size: :tiny
    t.string "avatar"
    t.string "spotify_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "refresh_token"
    t.index ["spotify_id"], name: "index_users_on_spotify_id", unique: true
  end

  add_foreign_key "checks", "tunes"
  add_foreign_key "checks", "users"
  add_foreign_key "comments", "communities"
  add_foreign_key "comments", "tunes"
  add_foreign_key "comments", "users"
  add_foreign_key "likes", "tunes"
  add_foreign_key "likes", "users"
  add_foreign_key "memberships", "communities"
  add_foreign_key "memberships", "users"
  add_foreign_key "playlists", "communities"
  add_foreign_key "playlists", "tunes"
end
