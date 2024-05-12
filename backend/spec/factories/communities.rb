FactoryBot.define do
  factory :community do
    name { "MyString" }
    introduction { "MyText" }
    avatar { "MyString" }
    playlist_name { "MyString" }
  end

  trait :with_playlist_tunes do
    transient do
      tunes_count { 5 }
    end

    after(:create) do |community, evaluator|
      create_list(:playlist, evaluator.tunes_count, community:)
    end
  end

  trait :with_members do
    transient do
      members_count { 5 }
    end

    after(:create) do |community, evaluator|
      create_list(:membership, evaluator.members_count, community:)
    end
  end

  trait :with_comments do
    transient do
      comments_count { 5 }
    end

    after(:create) do |community, evaluator|
      create_list(:comment, evaluator.comments_count, community:)
    end
  end
end
