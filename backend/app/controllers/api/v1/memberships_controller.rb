module Api
  module V1
    class MembershipsController < ApplicationController
      def create
        @membership = Membership.new(
          community_id: params[:community_id],
          user_id: params[:user_id]
        )
        if @membership.save
          # Userのlike_tunesをCommunityのplaylist_tunesに追加
          community = Community.find_by(id: params[:community_id])
          user = User.find_by(id: params[:user_id])
          if user&.like_tunes.present?
            user.like_tunes.each do |like_tune|
              existing_record = community.playlist_tunes.find_by(spotify_uri: like_tune.spotify_uri)

              Playlist.create(community_id: community.id, tune_id: like_tune.id) if existing_record.nil?
            end
          end
          render json: @membership, status: :created
        else
          render json: @membership.errors, status: :unprocessable_entity
        end
      end

      # def destroy
      #   @membership = Membership.find(params[:id])
      #   @membership.destroy
      # end
    end
  end
end
