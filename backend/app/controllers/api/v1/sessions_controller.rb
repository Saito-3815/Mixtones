module Api
  module V1
    class SessionsController < ApplicationController
      extend SpotifyAuth
      include SessionsHelper
      include UserLogin

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

        if existing_user
          update_result = update_user_and_like_tunes(existing_user, refresh_token, user_create_params)
          set_session_expiration_from_params(spotify_login_params[:is_persistent])

          render json: {
            user: update_result[:user].as_json(except: :refresh_token),
            session_id: update_result[:session_id]
          }, status: :ok
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
        response.set_cookie('_session_id', value: '', path: '/', domain: 'localhost',expires: Time.now - 1.year, httponly: true)
        render json: { message: 'Logged out' }, status: :ok
      end

      def current_user_show
        if current_user.nil?
          render json: { error: 'User not found' }, status: :not_found
        else
          render json: @current_user.as_json(except: :refresh_token), status: :ok
        end
      end

      def guest_login
        user = User.find_by(spotify_id: 'guest_user') # ゲストユーザーを特定
        if user
          log_in(user)
          current_user
          save_original_guest_data
          request.session_options[:expire_after] = 1.hour
          render json: { user: user.as_json(except: :refresh_token), message: 'Guest login successful' }, status: :ok
        else
          render json: {message: 'Guest user not found' }, status: :not_found
        end
      end

      # ゲストユーザーのオリジナルデータを保存する
      def save_original_guest_data
        session[:original_guest_data] = @current_user.attributes
      end

      # セッション終了時にゲストユーザーのデータを復元する
      def restore_guest_data
        if current_user&.is_guest?
          original_data = session[:original_guest_data]
          @current_user.update(original_data)
        end
      end

      private

      def spotify_login_params
        params.require(:user).permit(:code, :code_verifier, :is_persistent)
      end
    end
  end
end
