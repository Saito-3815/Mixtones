class Playlist < ApplicationRecord
  belongs_to :tune
  belongs_to :community

  scope :active, -> { where(active: true) }

  validates :tune_id, uniqueness: { scope: :community_id }
end
