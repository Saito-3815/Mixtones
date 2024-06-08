module SpotifyAuth
  # トークンの取得
  def self.fetch_spotify_tokens(code)
    # .envファイルからクライアントIDとクライアントシークレットを読み込む
    client_id = ENV.fetch('SPOTIFY_CLIENT_ID', nil)
    client_secret = ENV.fetch('SPOTIFY_CLIENT_SECRET', nil)

    # RSpotifyにクライアントIDとクライアントシークレットを設定
    RSpotify.authenticate(client_id, client_secret)

    # フロントエンドから送信された認証コード
    auth_code = code

    # 認証コードを使用してアクセストークンとリフレッシュトークンを取得
    credentials = RSpotify::Account.new(code: auth_code).credentials

    # アクセストークンとリフレッシュトークンを返す
    { access_token: credentials[:access_token], refresh_token: credentials[:refresh_token] }
  end

  # Spotifyからユーザーデータを取得
  def self.fetch_authenticated_user_data(access_token)
    # アクセストークンを使用して認証されたユーザーのデータを取得
    user = RSpotify::User.new('token' => access_token)

    # 必要なユーザーデータを抽出
    user_create_params = {
      name: user.display_name,
      avatar: user.images.first['url'],
      spotify_id: user.id
    }

    # ユーザーの保存したトラックを取得
    saved_tracks = user.saved_tracks

    # 保存したトラックの情報を抽出
    user_create_params[:like_tunes] = saved_tracks.map do |track|
      {
        name: track.name,
        artist: track.artists.first.name,
        album: track.album.name,
        images: track.album.images,
        spotify_uri: track.uri,
        preview_url: track.preview_url,
        added_at: track.added_at
      }
    end

    user_create_params
  end
end
