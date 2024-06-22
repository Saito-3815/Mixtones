class AddTimeToTunes < ActiveRecord::Migration[7.0]
  def change
    add_column :tunes, :time, :integer
  end
end
