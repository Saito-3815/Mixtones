FactoryBot.define do
  factory :comment do
    user
    community
    tune
    body { "MyText" }
  end
end
