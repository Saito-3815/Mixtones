module Api
  module V1
    class UsersController < ApplicationController
      def show
        @user = User.find(params[:id])
        render json: @user
      end

      def edit
        @user = User.find(params[:id])
        render json: @user
      end

      def create
        @user = User.new(
          name: user_create_params[:name],
          avatar: user_create_params[:avatar],
          spotify_id: user_create_params[:spotify_id]
        )
        if @user.save
          # like_tunesを一緒に登録
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
              # 既存のレコードが存在する場合、既存のレコードをlike_tunesに追加
              @user.like_tunes << existing_record
            end
          end
          render json: @user, status: :created
        else
          render json: @user.errors, status: :unprocessable_entity
        end
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
      end

      private

      # ユーザー作成時のパラメータ
      # ユーザー作成時には、like_tunesも一緒に登録する
      def user_create_params
        params.require(:user).permit(
          :name,
          :avatar,
          :spotify_id,
          like_tunes: [:name, :artist, :album, :images, :spotify_uri, :preview_url, :added_at]
        )
      end

      def user_update_params
        params.require(:user).permit(:name, :introduction, :avatar)
      end
    end
  end
end
