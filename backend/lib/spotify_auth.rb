require 'rspotify'

module SpotifyAuth
  # トークンの取得
  def self.fetch_spotify_tokens(code)
    begin
      client_id = ENV.fetch('SPOTIFY_CLIENT_ID', nil)
      client_secret = ENV.fetch('SPOTIFY_CLIENT_SECRET', nil)

      # RSpotifyにクライアントIDとクライアントシークレットを設定
      RSpotify.authenticate(client_id, client_secret)

      # フロントエンドから送信された認証コード
      auth_code = code

      # 認証コードを使用してアクセストークンとリフレッシュトークンを取得
      user = RSpotify::User.find(auth_code)

      # アクセストークンとリフレッシュトークンを返す
      { access_token: user.credentials['token'], refresh_token: user.credentials['refresh_token'] }
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
