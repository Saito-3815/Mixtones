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
        @user = User.new(name: user_params[:name], avatar: user_params[:avatar], spotify_id: user_params[:spotify_id])
        if @user.save
          # userに紐づくlike_tunesを作成
          # @user.like_tunes.create(user_params[:like_tunes].map(&:attributes))
          # user_params[:like_tunes]配列からlike_tuneハッシュを取り出し、それぞれの要素をlike_tuneとしてcreate
          user_params[:like_tunes].each do |like_tune|
            @user.like_tunes.create(like_tune)
          end
          render json: @user, status: :created
        else
          render json: @user.errors, status: :unprocessable_entity
        end
      end

      # def update
      #   @user = User.find(params[:id])
      #   if @user.update(user_params)
      #     render json: @user
      #   else
      #     render json: @user.errors, status: :unprocessable_entity
      #   end
      # end

      # def destroy
      #   @user = User.find(params[:id])
      #   @user.destroy
      # end

      private

      def user_params
        params.require(:user).permit(:name, :avatar, :spotify_id, like_tunes: [[[:name, :artist, :album, :images, :spotify_uri, :preview_url, :added_at]]])
      end
    end
  end
end
