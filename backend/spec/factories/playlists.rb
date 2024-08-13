FactoryBot.define do
  factory :playlist do
    community
    tune
    recommend { false }
  end
end
