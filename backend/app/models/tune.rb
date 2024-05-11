class Tune < ApplicationRecord
  has_many :playlist_tunes, dependent: :destroy
  has_many :likes, dependent: :destroy
  has_many :checks, dependent: :destroy
  has_many :comments, dependent: :destroy

  validates :name,        presence: true
  validates :artist,      presence: true
  validates :album,       presence: true
  validates :added_at,    presence: true
  validates :spotify_uri, presence: true, uniqueness: true
end
