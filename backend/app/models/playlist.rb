class Playlist < ApplicationRecord
  belongs_to :tune
  belongs_to :community

  scope :recommend, -> { where(recommend: true) }

  validates :tune_id, uniqueness: { scope: :community_id }
end
