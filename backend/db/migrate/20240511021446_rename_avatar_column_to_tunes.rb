class RenameAvatarColumnToTunes < ActiveRecord::Migration[7.0]
  def change
    rename_column :tunes, :avatar, :images
  end
end
