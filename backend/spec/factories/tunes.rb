FactoryBot.define do
  factory :tune do
    name { "MyString" }
    artist { "MyString" }
    album { "MyString" }
    images { "MyString" }
    spotify_uri { "spotify:track:#{SecureRandom.hex(10)}" }
    preview_url { "MyString" }
    added_at { "MyString" }
  end
end
