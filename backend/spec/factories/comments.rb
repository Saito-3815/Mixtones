FactoryBot.define do
  factory :comment do
    user_id { 1 }
    community_id { 1 }
    tune_id { 1 }
    body { "MyText" }
  end
end
