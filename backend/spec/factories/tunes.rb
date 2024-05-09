FactoryBot.define do
  factory :tune do
    # association :user, factory: :user
    name { "MyString" }
    artist { "MyString" }
    album { "MyString" }
    avatar { "MyString" }
    spotify_uri { "spotify:track:#{SecureRandom.hex(10)}" }
    preview_url { "MyString" }
    added_at { "MyString" }
  end
end
