module Api
  module V1
    class CommunitiesController < ApplicationController
      include SessionsHelper

      def index
        @communities = Community.all
        @communities_with_avatar_url = @communities.map do |community|
          avatar_url = community.generate_s3_url(community.avatar) if community.avatar.present?
          community.attributes.merge(avatar_url: avatar_url)
        end
        render json: @communities_with_avatar_url
      end

      def show
        @community = Community.find(params[:id])
        avatar_url = @community.generate_s3_url(@community.avatar) if @community.avatar.present?
        render json: @community.as_json(include: ['members'], methods: [:playlist_tunes_count]).merge(avatar: avatar_url)
      end

      def edit
        @community = Community.find(params[:id])
        avatar_url = @community.generate_s3_url(key: @community.avatar)
        render json: @community.as_json.merge(avatar: avatar_url)
      end

      def create
        @community = build_community
        if @community.save
          create_membership
          add_like_tunes_to_playlist
          # avatar_url = @community.generate_s3_url(key: @community.avatar)
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
        # current_userがcommunityのメンバーに含まれているか確認
        unless @community.members.include?(current_user)
          return render json: { error: '権限がありません' }, status: :forbidden
        end

        # リクエストに:communityが含まれている場合、community_paramsを更新
        if @community.update(community_params)
          avatar_url = @community.generate_s3_url(key: @community.avatar)
          render json: @community.as_json.merge(avatar: avatar_url)
        else
          render json: @community.errors, status: :unprocessable_entity
        end
      end

      def update_avatar
        @community = Community.find(params[:community_id])
        @community.avatar = params[:key]
        @community.save
        render status: :ok
      end

      def destroy
        @community = Community.find(params[:id])
        @community.destroy
      end

      private

      def community_params
        params.require(:community).permit(:name, :introduction, :playlist_name)
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
