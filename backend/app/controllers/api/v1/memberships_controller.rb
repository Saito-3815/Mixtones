module Api
  module V1
    class MembershipsController < ApplicationController
      # コミュニティにメンバーを追加
      # Userのlike_tunesをCommunityのplaylist_tunesに追加
      def create
        @membership = Membership.new(community_id: params[:community_id], user_id: params[:user_id])
        if @membership.save
          community = Community.find_by(id: params[:community_id])
          user = User.find_by(id: params[:user_id])
          return render json: { error: 'Community or User not found' }, status: :not_found if community.nil? || user.nil?

          added_tunes = add_like_tunes_to_community_playlist(community, user)
          render json: {
            community: community.as_json(include: ['members']),
            user: user.as_json(include: { communities: { only: [:id] } }),
            added_tunes: added_tunes
          }, status: :created
        else
          render json: @membership.errors, status: :unprocessable_entity
        end
      end

      # コミュニティからメンバーを削除
      # Userのlike_tunesをCommunityのplaylist_tunesから削除
      # Communityのplaylist_tunesに他のmembersの重複していたlike_tunesを追加
      def destroy
        @membership = Membership.find_by(community_id: params[:community_id], user_id: params[:user_id])
        if @membership.destroy
          community = Community.find_by(id: params[:community_id])
          user = User.find_by(id: params[:user_id])
          remove_like_tunes_from_playlist(user, community) if user&.like_tunes.present?
          add_missing_like_tunes_to_playlist(community)
          head :no_content
        end
      end

      private

      def add_like_tunes_to_community_playlist(community, user)
        added_tunes = []
        spotify_uris = user.like_tunes.pluck(:spotify_uri)
        existing_uris = community.playlist_tunes.where(spotify_uri: spotify_uris).pluck(:spotify_uri)

        (spotify_uris - existing_uris).each do |uri|
          like_tune = user.like_tunes.find_by(spotify_uri: uri)
          added_tune = Playlist.create(community_id: community.id, tune_id: like_tune.id)
          added_tunes << added_tune
        end

        added_tunes
      end

      # Userのlike_tunesをCommunityのplaylist_tunesから削除
      def remove_like_tunes_from_playlist(user, community)
        user.like_tunes.each do |like_tune|
          playlist = Playlist.find_by(community_id: community.id, tune_id: like_tune.id)
          playlist.destroy if playlist.present?
        end
      end

      # Communityのplaylist_tunesに他のmembersの重複していたlike_tunesを追加
      def add_missing_like_tunes_to_playlist(community)
        community.members.includes(:like_tunes).find_each do |member|
          member.like_tunes.each do |like_tune|
            existing_record = community.playlist_tunes.find_by(spotify_uri: like_tune.spotify_uri)
            Playlist.create(community_id: community.id, tune_id: like_tune.id) if existing_record.nil?
          end
        end
      end
    end
  end
end
