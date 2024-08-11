class AddDefaultToRecommendInPlaylists < ActiveRecord::Migration[7.0]
  def change
    change_column_default :playlists, :recommend, false
  end
end
