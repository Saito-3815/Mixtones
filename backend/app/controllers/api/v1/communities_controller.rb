module Api
  module V1
    class CommunitiesController < ApplicationController
      include SessionsHelper

      def index
        @communities = Community.all
        render json: @communities
      end

      def show
        @community = Community.find(params[:id])
        render json: @community.as_json(include: ['members'], methods: [:playlist_tunes_count])
      end

      def edit
        @community = Community.find(params[:id])
        render json: @community
      end

      def create
        @community = build_community
        if @community.save
          create_membership
          add_like_tunes_to_playlist
          # community_url = "#{ENV.fetch('FRONTEND_URL', nil)}communities/#{@community[:id]}"
          # render json: {
          #   community: @community,
          #   redirect_url: community_url
          #   }, status: :created
          render json: {
            community: @community,
            user: current_user.as_json(include: { communities: { only: [:id] } })
          }, status: :created
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
          render status: :unprocessable_entity
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

      def build_community
        Community.new(
          name: "#{current_user.name}のコミュニティ",
          introduction: "",
          avatar: "",
          playlist_name: "#{current_user.name}のプレイリスト"
        )
      end

      def create_membership
        @community.memberships.create(user_id: current_user.id)
      end

      # コミュニティに参加したmemberのlike_tunesをplaylistに追加
      def add_like_tunes_to_playlist
        if current_user&.like_tunes.present?
          current_user.like_tunes.each do |like_tune|
            Playlist.create(community_id: @community.id, tune_id: like_tune.id)
          end
        end
      end
    end
  end
end
