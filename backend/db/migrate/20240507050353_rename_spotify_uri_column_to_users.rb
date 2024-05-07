class RenameSpotifyUriColumnToUsers < ActiveRecord::Migration[7.0]
  def change
    rename_column :users, :spotify_uri, :spotify_id
  end
end
