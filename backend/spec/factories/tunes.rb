FactoryBot.define do
  factory :tune do
    name { "MyString" }
    artist { "MyString" }
    album { "MyString" }
    images { [{ "url" => "My_images_url" }] }
    spotify_uri { "spotify:track:#{SecureRandom.hex(10)}" }
    preview_url { "MyString" }
    added_at { Time.at(rand * Time.now.to_i).iso8601 }
    time { Time.at(rand(1..300)).iso8601 }
  end
end
