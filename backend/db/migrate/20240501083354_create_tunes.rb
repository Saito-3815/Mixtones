class CreateTunes < ActiveRecord::Migration[7.0]
  def change
    create_table :tunes do |t|
      t.string :name
      t.string :artist
      t.string :album
      t.string :avatar
      t.string :spotify_uri
      t.string :preview_url
      t.string :added_at

      t.timestamps
    end
  end
end
