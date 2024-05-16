class AddPlaylistNameToCommunities < ActiveRecord::Migration[7.0]
  def change
    add_column :communities, :playlist_name, :string
  end
end
