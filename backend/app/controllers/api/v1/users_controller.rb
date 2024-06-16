require 'rspotify'

module Api
  module V1
    class UsersController < ApplicationController
      extend SpotifyAuth
      include SessionsHelper

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
        decoded_code = Base64.decode64(params[:user][:code])
        code_verifier = params[:user][:code_verifier]
        tokens = SpotifyAuth.fetch_spotify_tokens(decoded_code, code_verifier)
        access_token = tokens[:access_token]
        refresh_token = tokens[:refresh_token]

        # Log the token values
        Rails.logger.info "Access Token: #{access_token}"
        Rails.logger.info "Refresh Token: #{refresh_token}"

        user_create_params = SpotifyAuth.fetch_authenticated_user_data(access_token)
        spotify_id = user_create_params[:spotify_id]
        SpotifyAuth.fetch_saved_tracks(spotify_id, access_token, user_create_params)
        Rails.logger.info "User Create Params: #{user_create_params}"

        existing_user = User.find_by(spotify_id: spotify_id)

        if existing_user
          # Update the existing user's refresh token
          existing_user.update(refresh_token: refresh_token)
          log_in(existing_user)
          render json: { user: existing_user.as_json(except: :refresh_token), session_id: session[:session_id] }, status: :ok
        else
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

            log_in(@user)
          end

          render json: { user: @user.as_json(except: :refresh_token), session_id: session[:session_id] }, status: :created
        end
      rescue StandardError => e
        Rails.logger.error "An error occurred: #{e.message}"
        Rails.logger.error e.backtrace.join("\n")
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

      def user_update_params
        params.require(:user).permit(:name, :introduction, :avatar)
      end
    end
  end
end
