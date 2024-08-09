FactoryBot.define do
  factory :user do
    name { "MyString" }
    introduction { "MyText" }
    avatar { "MyString" }
    spotify_id { SecureRandom.hex(10) }
    sequence(:email) { |n| "user#{n}@example.com" }
    password { "password" }

    trait :with_like_tunes do
      transient do
        tunes_count { 5 }
      end

      after(:create) do |user, evaluator|
        create_list(:like, evaluator.tunes_count, user:)
      end
    end

    trait :with_check_tunes do
      transient do
        tunes_count { 5 }
      end

      after(:create) do |user, evaluator|
        create_list(:check, evaluator.tunes_count, user:)
      end
    end

    trait :with_communities do
      transient do
        communities_count { 2 }
      end

      after(:create) do |user, evaluator|
        create_list(:membership, evaluator.communities_count, user:)
      end
    end

    trait :with_comments do
      transient do
        comments_count { 5 }
      end

      after(:create) do |user, evaluator|
        create_list(:comment, evaluator.comments_count, user:)
      end
    end
  end
end
