module Api
  module V1
    class CommunitiesController < ApplicationController
      def index
        @communities = Community.all
        render json: @communities
      end

      def show
        @community = Community.find(params[:id])
        render json: @community, include: ['members']
      end

      def edit
        @community = Community.find(params[:id])
        render json: @community
      end

      def create
        @community = Community.new(
          name: "#{params[:user_name]}のコミュニティ",
          introduction: "",
          avatar: "",
          playlist_name: "#{params[:user_name]}のプレイリスト"
        )
        if @community.save
          # communityに紐づくmembershipを作成
          @community.memberships.create(user_id: params[:user_id])
          # @communityに紐づくplaylistにlike_tunesを追加
          user = User.find_by(id: params[:user_id])
          if user&.like_tunes.present?
            user.like_tunes.each do |like_tune|
              Playlist.create(community_id: @community.id, tune_id: like_tune.id)
            end
          end
          render json: @community, status: :created
        else
          render json: @community.errors, status: :unprocessable_entity
        end
      end

      def update
        @community = Community.find(params[:id])
        # リクエストに:communityが含まれている場合、community_paramsを更新
        if @community.update(community_params)
          render json: @community
        else
          render json: @community.errors, status: :unprocessable_entity
        end
      end

      def destroy
        @community = Community.find(params[:id])
        @community.destroy
      end

      private

      def community_params
        params.require(:community).permit(:name, :introduction, :avatar)
      end
    end
  end
end
