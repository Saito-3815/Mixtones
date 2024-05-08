class CreateComments < ActiveRecord::Migration[7.0]
  def change
    create_table :comments do |t|
      t.references :user,       null: false, foreign_key: true
      t.references :community,  null: false, foreign_key: true
      t.references :tune,       null: false, foreign_key: true
      t.text :body,             null: false, limit: 2000

      t.timestamps
    end
  end
end
