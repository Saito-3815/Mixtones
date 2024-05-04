class CreatePlaylists < ActiveRecord::Migration[7.0]
  def change
    create_table :playlists do |t|
      t.references :community,  null: false, foreign_key: true
      t.references :tune,       null: false, foreign_key: true
      t.boolean :active

      t.timestamps
    end
    add_index :playlists, [:community_id, :tune_id], unique: true
  end
end
