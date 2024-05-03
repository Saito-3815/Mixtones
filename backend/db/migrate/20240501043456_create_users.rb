class CreateUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :users do |t|
      t.string :name,              null: false, limit: 40
      t.text :introduction,        limit: 160
      t.string :avatar
      t.string :spotify_uri

      t.timestamps
    end
    add_index :users, [:spotify_uri], unique: true
  end
end
