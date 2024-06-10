require 'rspotify'

module SpotifyAuth
  # トークンの取得
  def self.fetch_spotify_tokens(code, code_verifier)
    begin
      client_id = ENV.fetch('SPOTIFY_CLIENT_ID', nil)
      client_secret = ENV.fetch('SPOTIFY_CLIENT_SECRET', nil)
      redirect_uri = ENV.fetch('SPOTIFY_REDIRECT_URI', nil)

      # RSpotifyにクライアントIDとクライアントシークレットを設定
      RSpotify.authenticate(client_id, client_secret)

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
        redirect_uri: redirect_uri,
        client_id: client_id,
        client_secret: client_secret,
        code_verifier: code_verifier
      })

      response = http.request(request)

      Rails.logger.info "redirect_uri: #{redirect_uri}"
      Rails.logger.info "client_id: #{client_id}"
      Rails.logger.info "client_secret: #{client_secret}"
      Rails.logger.info "code_verifier: #{code_verifier}"
      Rails.logger.info "auth_code: #{auth_code}"

      token_info = JSON.parse(response.body)

      # # アクセストークンとリフレッシュトークンをログに出力
      # Rails.logger.info "access_token: #{token_info['access_token']}"
      # Rails.logger.info "refresh_token: #{token_info['refresh_token']}"

      # アクセストークンとリフレッシュトークンを返す
      { access_token: token_info['access_token'], refresh_token: token_info['refresh_token'] }
    rescue => e
      Rails.logger.error "Error fetching Spotify tokens: #{e.message}"
      raise
    end
  end

  # Spotifyからユーザーデータを取得
  def self.fetch_authenticated_user_data(access_token)
    begin
      # アクセストークンを使用して認証されたユーザーのデータを取得
      user = RSpotify::User.find(access_token)

      # userがnilでないことを確認
      if user.nil?
        Rails.logger.error "Error: User not found with provided access token"
        raise "User not found"
      end

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
        # ...
      end
    rescue => e
      Rails.logger.error "Error fetching authenticated user data: #{e.message}"
      raise
    end
  end
end
