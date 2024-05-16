FactoryBot.define do
  factory :playlist do
    community
    tune
    active { false }
  end
end
