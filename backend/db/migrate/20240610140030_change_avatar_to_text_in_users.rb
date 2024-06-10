class ChangeAvatarToTextInUsers < ActiveRecord::Migration[6.0]
  def change
    change_column :users, :avatar, :text
  end
end
