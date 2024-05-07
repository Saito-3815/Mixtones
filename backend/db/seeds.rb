3.times do |n|
  community = Community.create!(
    name: "test_community_#{n + 1}",
    introduction: "test_community_#{n + 1} introduction",
    avatar: "test_community_#{n + 1}.png"
  )

  4.times do |m|
    community.members.create!(
      name: "test_user_#{m + 1}",
      introduction: "test_user_#{m + 1} introduction",
      avatar: "test_user_#{m + 1}.png",
      # spotify_idにはランダムな文字列を設定
      spotify_id: SecureRandom.hex(10)
    )

    # membersごとにlike_tunesを作成
    10.times do |o|
      community.members[m].like_tunes.create!(
        name: "test_tune_#{o + 1}",
        artist: "test_artist_#{o + 1}",
        album: "test_album_#{o + 1}",
        avatar: "test_tune_#{o + 1}.png",
        spotify_uri: "spotify:track:#{SecureRandom.hex(10)}",
        preview_url: "https://test.com/preview_#{o + 1}.mp3",
        # added_atにランダムな日付をISO8601形式で設定
        added_at: Time.at(rand * Time.now.to_i).iso8601
      )

      # like_tunesに対してcommentを作成
      2.times do |q|
        community.members[m].like_tunes[o].comments.create!(
          community_id: community.id,
          user_id: community.members[m].id,
          body: "test_comment_#{q + 1}"
        )
      end
    end

    # membersごとにcheck_tunesを作成
    10.times do |p|
      community.members[m].check_tunes.create!(
        name: "test_tune_#{p + 1}",
        artist: "test_artist_#{p + 1}",
        album: "test_album_#{p + 1}",
        avatar: "test_tune_#{p + 1}.png",
        spotify_uri: "spotify:track:#{SecureRandom.hex(10)}",
        preview_url: "https://test.com/preview_#{p + 1}.mp3",
        added_at: Time.at(rand * Time.now.to_i).iso8601
      )
    end
  end
end
