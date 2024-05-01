class CreateCommunities < ActiveRecord::Migration[7.0]
  def change
    create_table :communities do |t|
      t.string :name
      t.text :introduction
      t.string :avatar

      t.timestamps
    end
  end
end
