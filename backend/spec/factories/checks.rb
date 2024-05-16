FactoryBot.define do
  factory :check do
    user
    tune
    active { true }
  end
end
