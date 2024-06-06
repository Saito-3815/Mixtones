require 'rspotify'

module Api
  module V1
    class UsersController < ApplicationController
      def show
        @user = User.find(params[:id])
        render json: @user, only: [:name, :introduction, :avatar]
      end

      def edit
        @user = User.find(params[:id])
        render json: @user, only: [:name, :introduction, :avatar]
      end

      # ユーザー作成
      # ユーザー作成時には、like_tunesも一緒に登録する
      def create
        tokens = fetch_spotify_tokens(params[:code])
        access_token = tokens[:access_token]
        refresh_token = tokens[:refresh_token]
        user_create_params = fetch_authenticated_user_data(access_token)

        User.transaction do
          @user = User.create!(
            name: user_create_params[:name],
            avatar: user_create_params[:avatar],
            spotify_id: user_create_params[:spotify_id],
            refresh_token: refresh_token
          )

          user_create_params[:like_tunes].each do |like_tune|
            existing_record = Tune.find_by(spotify_uri: like_tune[:spotify_uri])

            if existing_record.nil?
              @user.like_tunes.create!(
                name: like_tune[:name],
                artist: like_tune[:artist],
                album: like_tune[:album],
                images: like_tune[:images],
                spotify_uri: like_tune[:spotify_uri],
                preview_url: like_tune[:preview_url],
                added_at: like_tune[:added_at]
              )
            else
              @user.like_tunes << existing_record
            end
          end
        rescue StandardError => e
          Rails.logger.info e.message
        end

        render json: @user, status: :created
      rescue StandardError => e
        render json: { error: e.message }, status: :unprocessable_entity
      end

      def update
        @user = User.find(params[:id])
        if @user.update(user_update_params)
          render json: @user
        else
          render json: @user.errors, status: :unprocessable_entity
        end
      end

      def destroy
        @user = User.find(params[:id])
        @user.destroy
        render json: { message: 'User deleted' }, status: :ok
      end

      private

      # ユーザー作成時のパラメータ
      # ユーザー作成時には、like_tunesも一緒に登録する
      # def user_create_params
      #   params.require(:user).permit(
      #     :name,
      #     :avatar,
      #     :spotify_id,
      #     like_tunes: [:name, :artist, :album, :images, :spotify_uri, :preview_url, :added_at]
      #   )
      # end

      def user_update_params
        params.require(:user).permit(:name, :introduction, :avatar)
      end

      # トークンの取得
      def fetch_spotify_tokens(code)
        # .envファイルからクライアントIDとクライアントシークレットを読み込む
        client_id = ENV.fetch['SPOTIFY_CLIENT_ID']
        client_secret = ENV.fetch['SPOTIFY_CLIENT_SECRET']

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
      def fetch_authenticated_user_data(access_token)
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
  end
end
