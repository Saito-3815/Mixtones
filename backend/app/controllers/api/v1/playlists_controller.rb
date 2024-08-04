module Api
  module V1
    class PlaylistsController < ApplicationController
      extend SpotifyAuth
      include SessionsHelper
      include UserLogin

      def index
        community = Community.find_by(id: params[:community_id])
        Rails.logger.info "Found community with ID: #{community.id}" if community

        # コミュニティのメンバーがログインしている場合、like_tunesを取得し、playlist_tunesに追加
        community.members.each do |member|
          # Spotify IDが'guest_user'またはnilの場合は処理をスキップ
          next if member.spotify_id == 'guest_user' || member.spotify_id.nil?

          if logged_in?(member)
            Rails.logger.info "Member #{member.id} is logged in."
            access_token = SpotifyAuth.refresh_access_token(member.refresh_token)
            like_tunes = SpotifyAuth.fetch_latest_saved_track(member, access_token)

            # 既存のトラックに新しいカラムのデータをフェッチして挿入
            # SpotifyAuth.update_existing_tracks_with_external_url(member, access_token)

            extract_first_image_url(like_tunes)

            like_tunes.each do |like_tune|
              Rails.logger.info "Processing like_tune: #{like_tune[:name]}, URI: #{like_tune[:spotify_uri]}"
              existing_record = Tune.find_by(spotify_uri: like_tune[:spotify_uri])

              if existing_record.nil?
                member.like_tunes.create!(
                  name: like_tune[:name],
                  artist: like_tune[:artist],
                  album: like_tune[:album],
                  images: like_tune[:images],
                  spotify_uri: like_tune[:spotify_uri],
                  preview_url: like_tune[:preview_url],
                  added_at: like_tune[:added_at],
                  time: like_tune[:time],
                  external_url: like_tune[:external_url]
                )
                Rails.logger.info "Created new like_tune: #{like_tune[:name]}, URI: #{like_tune[:spotify_uri]}"
              elsif member.like_tunes.exists?(existing_record.id)
                Rails.logger.info "Existing like_tune found, not added: #{existing_record.name},
                URI: #{existing_record.spotify_uri}"
              else
                member.like_tunes << existing_record
                Rails.logger.info "Added existing like_tune: #{existing_record.name},
                URI: #{existing_record.spotify_uri}"
              end
            end

            member.like_tunes.each do |like_tune|
              next if community.playlist_tunes.exists?(spotify_uri: like_tune.spotify_uri)

              community.playlist_tunes << like_tune
              Rails.logger.info "Added like_tune to community playlist: #{like_tune.name},
              URI: #{like_tune.spotify_uri}"
            end
          else
            Rails.logger.info "Member #{member.id} is not logged in."
          end
        end

        @playlists = community.playlist_tunes.order(added_at: :desc)
        Rails.logger.info "Rendering playlist with #{community.playlist_tunes.count} tunes."
        render json: @playlists
      end
    end
  end
end
