class CreateTunes < ActiveRecord::Migration[7.0]
  def change
    create_table :tunes do |t|
      t.string :name,         null: false
      t.string :artist,       null: false
      t.string :album,        null: false
      t.string :avatar,       null: false
      t.string :spotify_uri,  null: false
      t.string :preview_url
      t.string :added_at,     null: false

      t.timestamps
    end
    add_index :tunes, [:spotify_uri], unique: true
  end
end
