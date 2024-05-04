class Like < ApplicationRecord
  belongs_to :tune
  belongs_to :user

  validates :tune_id, uniqueness: { scope: :user_id }
end
