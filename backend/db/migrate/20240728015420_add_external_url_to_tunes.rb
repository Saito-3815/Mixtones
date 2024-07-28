class AddExternalUrlToTunes < ActiveRecord::Migration[7.0]
  def change
    add_column :tunes, :external_url, :string
  end
end
