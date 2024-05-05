3.times do |n|
  community = Community.new(
    name: "test_community_#{n}",
    introduction: "test_community_#{n} introduction",
    avatar: "test_community_#{n}.png"
  )

  4.times do |m|
    community.members.build(
      name: "test_user_#{m}",
      introduction: "test_user_#{m} introduction",
      avatar: "test_user_#{m}.png",
      spotify_uri: "spotify:uri:#{m}"
    )

    # membersごとにlike_tunesを作成
    10.times do |o|
      community.members[m].like_tunes.build(
        name: "test_tune_#{o}",
        artist: "test_artist_#{o}",
        album: "test_album_#{o}",
        avatar: "test_tune_#{o}.png",
        spotify_uri: "spotify:uri:#{o}"
      )
    end
  end
end
