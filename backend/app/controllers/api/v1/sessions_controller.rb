module Api
  module V1
    class SessionsController < ApplicationController
      include SessionsHelper

      def create
        decoded_code = Base64.decode64(spotify_login_params[:code])
        code_verifier = spotify_login_params[:code_verifier]
        tokens = SpotifyAuth.fetch_spotify_tokens(decoded_code, code_verifier)
        access_token = tokens[:access_token]
        refresh_token = tokens[:refresh_token]

        # Log the token values
        Rails.logger.info "Access Token: #{access_token}"
        Rails.logger.info "Refresh Token: #{refresh_token}"

        user_create_params = SpotifyAuth.fetch_authenticated_user_data(access_token)
        spotify_id = user_create_params[:spotify_id]
        SpotifyAuth.fetch_saved_tracks(spotify_id, access_token, user_create_params)

        user = User.find_by(spotify_id: spotify_id)

        if user
          user.update(refresh_token: refresh_token)
          reset_session
          log_in(user)

          user_create_params[:like_tunes].each do |like_tune|
            existing_record = Tune.find_by(spotify_uri: like_tune[:spotify_uri])

            if existing_record.nil?
              user.like_tunes.create!(
                name: like_tune[:name],
                artist: like_tune[:artist],
                album: like_tune[:album],
                images: like_tune[:images],
                spotify_uri: like_tune[:spotify_uri],
                preview_url: like_tune[:preview_url],
                added_at: like_tune[:added_at]
              )
            else
              # 既存のレコードがユーザーに紐づいていないことを確認してから追加
              user.like_tunes << existing_record unless user.like_tunes.exists?(existing_record.id)
            end
          end
          render json: {
            user: user.as_json(except: :refresh_token),
            session_id: session[:session_id]
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
        log_out
        response.set_cookie('_session_id', value: '', path: '/', domain: 'localhost',expires: Time.now - 1.year, httponly: true)
        render json: { message: 'Logged out' }, status: :ok
      end

      private

      def spotify_login_params
        params.require(:user).permit(:code, :code_verifier)
      end
    end
  end
end
