class RenameActiveToRecommendInPlaylists < ActiveRecord::Migration[7.0]
  def change
    rename_column :playlists, :active, :recommend
  end
end
