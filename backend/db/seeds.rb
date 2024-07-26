3.times do |n|
  community = Community.find_or_create_by!(
    name: "test_community_#{n + 1}",
    introduction: "test_community_#{n + 1} introduction",
    avatar: "https://picsum.photos/500",
    playlist_name: "test_playlist_#{n + 1}"
  )

  4.times do |m|
    community.members.find_or_create_by!(
      name: "test_user_#{m + 1}",
      introduction: "test_user_#{m + 1} introduction",
      avatar: "https://picsum.photos/500",
      # spotify_idにはランダムな文字列を設定
      spotify_id: SecureRandom.hex(10)
    )

    # membersごとにlike_tunesを作成
    10.times do |o|
      community.members[m].like_tunes.find_or_create_by!(
        name: "test_tune_#{o + 1}",
        artist: "test_artist_#{o + 1}",
        album: "test_album_#{o + 1}",
        images: "https://picsum.photos/500",
        spotify_uri: "spotify:track:#{SecureRandom.uuid}",
        preview_url: "https://test.com/preview_#{o + 1}.mp3",
        # added_atにランダムな日付をISO8601形式で設定
        added_at: Time.at(rand * Time.now.to_i).iso8601,
        time: rand(60..1200)
      )

      # like_tunesに対してcommentを作成
      2.times do |q|
        community.members[m].like_tunes[o].comments.find_or_create_by!(
          community_id: community.id,
          user_id: community.members[m].id,
          body: "test_comment_#{q + 1}"
        )
      end

      community.playlist_tunes << community.members[m].like_tunes[o]
    end

    # membersごとにcheck_tunesを作成
    10.times do |p|
      community.members[m].check_tunes.find_or_create_by!(
        name: "test_tune_#{p + 1}",
        artist: "test_artist_#{p + 1}",
        album: "test_album_#{p + 1}",
        images: "https://picsum.photos/500",
        spotify_uri: "spotify:track:#{SecureRandom.uuid}",
        preview_url: "https://test.com/preview_#{p + 1}.mp3",
        added_at: Time.at(rand * Time.now.to_i).iso8601,
        time: rand(60..1200)
      )
    end
  end



  # communityに紐づくplaylist_tunesを作成
  # 10.times do |r|
  #   community.playlist_tunes.create!(
  #     name: "test_tune_#{r + 1}",
  #     artist: "test_artist_#{r + 1}",
  #     album: "test_album_#{r + 1}",
  #     images: "test_tune_#{r + 1}.png",
  #     spotify_uri: "spotify:track:#{SecureRandom.hex(10)}",
  #     preview_url: "https://test.com/preview_#{r + 1}.mp3",
  #     added_at: Time.at(rand * Time.now.to_i).iso8601
  #   )
  # end
end
