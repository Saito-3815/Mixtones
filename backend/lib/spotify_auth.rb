require 'rspotify'

module SpotifyAuth
  CLIENT_ID = ENV.fetch('SPOTIFY_CLIENT_ID', nil)
  CLIENT_SECRET = ENV.fetch('SPOTIFY_CLIENT_SECRET', nil)
  REDIRECT_URI = ENV.fetch('SPOTIFY_REDIRECT_URI', nil)

  # トークンの取得
  def self.fetch_spotify_tokens(code, code_verifier)
    # RSpotifyにクライアントIDとクライアントシークレットを設定
    RSpotify.authenticate(CLIENT_ID, CLIENT_SECRET)

    # フロントエンドから送信された認証コード
    auth_code = code

    # 認証コードを使用してアクセストークンとリフレッシュトークンを取得
    uri = URI('https://accounts.spotify.com/api/token')
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    request = Net::HTTP::Post.new(uri.path)
    request['Content-Type'] = 'application/x-www-form-urlencoded'
    request.body = URI.encode_www_form({
                                         grant_type: 'authorization_code',
                                         code: auth_code,
                                         redirect_uri: REDIRECT_URI,
                                         client_id: CLIENT_ID,
                                         client_secret: CLIENT_SECRET,
                                         code_verifier: code_verifier
                                       })

    response = http.request(request)
    token_info = JSON.parse(response.body)

    # アクセストークンとリフレッシュトークンを返す
    { access_token: token_info['access_token'], refresh_token: token_info['refresh_token'] }
  rescue StandardError => e
    Rails.logger.error "Error fetching Spotify tokens: #{e.message}"
    raise
  end

  # Spotifyからユーザーデータを取得
  def self.fetch_authenticated_user_data(access_token)
    # アクセストークンを使用して認証されたユーザーのデータを取得
    uri = URI.parse("https://api.spotify.com/v1/me")
    request = Net::HTTP::Get.new(uri)
    request["Authorization"] = "Bearer #{access_token}"
    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == 'https') do |http|
      http.request(request)
    end

    user = JSON.parse(response.body)

    # userの内容をログに出力
    Rails.logger.info "Fetched user data: #{user}"

    # userがnilでないことを確認
    if user.nil?
      Rails.logger.error "Error: User not found with provided access token"
      raise "User not found"
    end

    # 必要なユーザーデータを抽出
    {
      name: user['display_name'],
      avatar: user['images'].dig(0, 'url'),
      spotify_id: user['id']
    }
  rescue StandardError => e
    Rails.logger.error "Error fetching authenticated user data: #{e.message}"
    raise
  end

  # ユーザーの保存したトラックを取得
  def self.fetch_saved_tracks(spotify_id, access_token, user_create_params)
    uri = URI("https://api.spotify.com/v1/users/#{spotify_id}/tracks?limit=50")
    req = Net::HTTP::Get.new(uri)
    req['Authorization'] = "Bearer #{access_token}"

    res = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
      http.request(req)
    end

    saved_tracks = JSON.parse(res.body)

    # Rails.logger.info "Fetched saved tracks: #{saved_tracks}"

    # 保存したトラックの情報を抽出
    like_tunes = saved_tracks['items'].map do |item|
      track = item['track']
      {
        name: track['name'],
        artist: track['artists'].map { |artist| artist['name'] }.join(', '),
        album: track['album']['name'],
        images: track['album']['images'],
        spotify_uri: track['uri'],
        preview_url: track['preview_url'],
        added_at: item['added_at'],
        time: track['duration_ms'],
        external_url: track['external_urls']['spotify']
      }
    end

    user_create_params[:like_tunes] = like_tunes
  rescue StandardError => e
    Rails.logger.error "Error fetching saved_tracks: #{e.message}"
    raise
  end

  # リフレッシュトークンを使用してアクセストークンを更新
  def self.refresh_access_token(refresh_token)
    uri = URI('https://accounts.spotify.com/api/token')
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    request = Net::HTTP::Post.new(uri.path)
    request['Content-Type'] = 'application/x-www-form-urlencoded'
    request.basic_auth(CLIENT_ID, CLIENT_SECRET)
    request.body = URI.encode_www_form({
                                         grant_type: 'refresh_token',
                                         refresh_token: refresh_token
                                       })
    response = http.request(request)

    if response.is_a?(Net::HTTPSuccess)
      JSON.parse(response.body)['access_token']
    else
      Rails.logger.error "Failed to refresh access token: #{response.body}"
      nil
    end
  end

  # Spotifyの最新のお気に入り情報を取得
  def self.fetch_latest_saved_track(user, access_token)
    latest_added_at = user.like_tunes.last.added_at

    uri = URI("https://api.spotify.com/v1/users/#{user.spotify_id}/tracks?limit=50")
    req = Net::HTTP::Get.new(uri)
    req['Authorization'] = "Bearer #{access_token}"

    res = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
      http.request(req)
    end

    saved_tracks = JSON.parse(res.body)

    # デバッグ用にレスポンスをログに出力
    puts "Spotify API Response: #{saved_tracks}"

    # latest_added_atより新しい楽曲のみを選択
    filtered_tracks = saved_tracks['items'].select do |item|
      Time.zone.parse(item['added_at']) > latest_added_at
    end

    filtered_tracks.map do |item|
      track = item['track']
      {
        name: track['name'],
        artist: track['artists'].map { |artist| artist['name'] }.join(', '),
        album: track['album']['name'],
        images: track['album']['images'],
        spotify_uri: track['uri'],
        preview_url: track['preview_url'],
        added_at: item['added_at'],
        time: track['duration_ms'],
        external_url: track['external_urls']['spotify']
      }
    end
  end

  # 既存のレコードに後からカラムを追加した外部URLデータを追加
  def self.update_existing_tracks_with_external_url(user, access_token)
    # 既存のレコードを取得
    existing_tracks = user.like_tunes

    existing_tracks.each do |track|
      # Spotify APIから最新のデータをフェッチ
      uri = URI("https://api.spotify.com/v1/tracks/#{track.spotify_uri.split(':').last}")
      req = Net::HTTP::Get.new(uri)
      req['Authorization'] = "Bearer #{access_token}"

      res = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
        http.request(req)
      end

      if res.code.to_i == 429
        retry_after = res['Retry-After'].to_i
        sleep(retry_after)
        redo
      end

      track_data = JSON.parse(res.body)

      # 新しいカラムのデータを追加
      external_url = track_data.dig('external_urls', 'spotify')

      # 既存のレコードを更新
      track.update(external_url: external_url)
    end
  end
end
