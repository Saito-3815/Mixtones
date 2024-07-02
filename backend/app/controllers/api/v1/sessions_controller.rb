module Api
  module V1
    class SessionsController < ApplicationController
      extend SpotifyAuth
      include SessionsHelper
      include UserLogin
      include RenderUserJson

      def create
        decoded_code = Base64.decode64(spotify_login_params[:code])
        code_verifier = spotify_login_params[:code_verifier]
        tokens = SpotifyAuth.fetch_spotify_tokens(decoded_code, code_verifier)
        access_token = tokens[:access_token]
        refresh_token = tokens[:refresh_token]

        user_create_params = SpotifyAuth.fetch_authenticated_user_data(access_token)
        spotify_id = user_create_params[:spotify_id]
        SpotifyAuth.fetch_saved_tracks(spotify_id, access_token, user_create_params)

        existing_user = User.find_by(spotify_id: spotify_id)

        # ユーザーが存在する場合、ユーザー情報を更新し有効期限を設定
        if existing_user
          update_result = update_user_and_like_tunes(existing_user, refresh_token, user_create_params)
          update_session_expiration(spotify_login_params[:is_persistent])
          render_user_json(update_result[:user], access_token)
        else
          signup_url = "#{ENV.fetch('SPOTIFY_REDIRECT_URI', nil)}signup"
          render json: { message: 'User not found', redirect_url: signup_url }, status: :not_found
        end
      rescue StandardError => e
        Rails.logger.error "An error occurred: #{e.message}"
        render json: { message: 'An error occurred' }, status: :internal_server_error
      end

      def destroy
        restore_guest_data
        log_out
        response.set_cookie('_session_id', value: '', path: '/', domain: 'localhost', expires: 1.year.ago,
                                           httponly: true)
        render json: { message: 'Logged out' }, status: :ok
      end

      def current_user_show
        if current_user.nil?
          render json: { error: 'User not found' }, status: :not_found
        else
          access_token = SpotifyAuth.refresh_access_token(current_user.refresh_token)
          render_user_json(current_user, access_token)
        end
      end

      # ゲストログイン
      # オリジナルゲストユーザーデータをゲストユーザーにコピー
      def guest_login
        user = User.find_by(spotify_id: 'guest_user')
        if user
          copy_original_guest_data_to(user)
          log_in(user)
          request.session_options[:expire_after] = 1.hour
          render json: { user: user.as_json(except: :refresh_token), message: 'Guest login successful' }, status: :ok
        else
          render json: { message: 'Guest user not found' }, status: :not_found
        end
      end

      # オリジナルゲストユーザーデータの取得
      def fetch_original_guest_data
        @fetch_original_guest_data ||= User.find_by(spotify_id: 'original_guest_user')
      end

      # オリジナルデータを現在のゲストユーザーにコピー
      def copy_original_guest_data_to(user)
        original_data = fetch_original_guest_data.attributes.except('id', 'created_at', 'updated_at', 'spotify_id')
        user.update(original_data)
      end

      # セッション終了時にゲストユーザーのデータを復元する
      def restore_guest_data
        if current_user&.guest? && session[:original_guest_data].present?
          original_data = session[:original_guest_data]
          current_user.update(original_data)
        end
      end

      private

      def spotify_login_params
        params.require(:user).permit(:code, :code_verifier, :is_persistent)
      end
    end
  end
end
