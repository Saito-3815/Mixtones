class CreateCommunities < ActiveRecord::Migration[7.0]
  def change
    create_table :communities do |t|
      t.string :name,               null: false, limit: 40
      t.text :introduction,         limit: 160
      t.string :avatar

      t.timestamps
    end
  end
end
