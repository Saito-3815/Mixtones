FactoryBot.define do
  factory :user do
    name { "MyString" }
    introduction { "MyText" }
    avatar { "MyString" }
    spotify_id { SecureRandom.hex(10) }

    trait :with_like_tunes do
      transient do
        tunes_count { 5 }
      end

      after(:create) do |user, evaluator|
        create_list(:like, evaluator.tunes_count, user:)
      end
    end
  end
end
