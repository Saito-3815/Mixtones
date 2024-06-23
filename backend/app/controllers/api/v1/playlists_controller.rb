module Api
  module V1
    class PlaylistsController < ApplicationController
      extend SpotifyAuth
      include SessionsHelper

      def index
        community = Community.find_by(id: params[:community_id])
        # 全てのcommunity.memberに対して処理を行う
        community.members.each do |member|
          # メンバーがログイン中であるか確認
          if logged_in?(member)
            access_token = SpotifyAuth.refresh_access_token(member.refresh_token)
            like_tunes = SpotifyAuth.fetch_latest_saved_track(member.spotify_id, access_token)
            like_tunes.each do |like_tune|
              existing_record = Tune.find_by(spotify_uri: like_tune[:spotify_uri])

              if existing_record.nil?
                member.like_tunes.create!(
                  name: like_tune[:name],
                  artist: like_tune[:artist],
                  album: like_tune[:album],
                  images: like_tune[:images],
                  spotify_uri: like_tune[:spotify_uri],
                  preview_url: like_tune[:preview_url],
                  added_at: like_tune[:added_at]
                )
              else
                member.like_tunes << existing_record unless member.like_tunes.exists?(existing_record.id)
              end
            end

            # memberのlike_tunesをcommunity.playlist_tunesに追加
            member.like_tunes.each do |like_tune|
              unless community.playlist_tunes.exists?(spotify_uri: like_tune.spotify_uri)
                community.playlist_tunes << like_tune
              end
            end
          end
        end

        @playlists = community.playlist_tunes.order(added_at: :desc)
        render json: @playlists
      end
    end
  end
end
