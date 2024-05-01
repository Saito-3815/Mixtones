class CreateUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :users do |t|
      t.string :name
      t.text :introduction
      t.string :avatar
      t.string :spotify_uri

      t.timestamps
    end
  end
end
