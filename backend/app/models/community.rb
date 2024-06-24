class Community < ApplicationRecord
  has_many :memberships, dependent: :destroy
  has_many :members, through: :memberships, source: :user
  has_many :playlists, dependent: :destroy
  has_many :playlist_tunes, through: :playlists, source: :tune
  has_many :comments, dependent: :destroy

  validates :name,    presence: true, length: { maximum: 40 }
  validates :introduction, length: { maximum: 160 }
  validates :playlist_name, presence: true, length: { maximum: 40 }

  # プレイリストの曲数を返す
  def playlist_tunes_count
    playlist_tunes.count
  end
end
