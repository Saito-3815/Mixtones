class Comment < ApplicationRecord
  belongs_to :tune
  belongs_to :user
  belongs_to :community

  validates :body, presence: true, length: { maximum: 2000 }
end
