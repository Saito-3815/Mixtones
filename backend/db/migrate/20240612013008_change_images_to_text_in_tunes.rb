class ChangeImagesToTextInTunes < ActiveRecord::Migration[6.0]
  def change
    change_column :tunes, :images, :text
  end
end
