class User < ApplicationRecord
  has_many :memberships, dependent: :destroy
  has_many :communities, through: :memberships
  has_many :comments, dependent: :destroy
  has_many :likes, dependent: :destroy
  has_many :like_tunes, through: :likes, source: :tune
  has_many :checks, dependent: :destroy
  has_many :check_tunes, through: :checks, source: :tune

  validates :name,          presence: true, length: { maximum: 40 }
  validates :introduction,  length: { maximum: 160 }
  validates :spotify_id,    uniqueness: true
end
