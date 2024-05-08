class Check < ApplicationRecord
  belongs_to :tune
  belongs_to :user

  scope :active, -> { where(active: true) }

  validates :tune_id, uniqueness: { scope: :user_id }
end
