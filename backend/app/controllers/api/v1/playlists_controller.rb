module Api
  module V1
    class PlaylistsController < ApplicationController
      extend SpotifyAuth
      include SessionsHelper
      include UserLogin

      before_action :find_tune_and_community, only: [:create_recommend, :destroy_recommend]
      before_action :find_playlist_tune, only: [:create_recommend, :destroy_recommend]

      # コミュニティプレイリストを取得する
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

        @playlists = community.playlist_tunes.with_recommend.order(added_at: :desc)

        # デバッグ用のログを追加
        Rails.logger.debug { "Filtered playlists: #{@playlists.map(&:attributes)}" }

        Rails.logger.info "Rendering playlist with #{community.playlist_tunes.count} tunes."

        # commentsのtune_idのみを含める
        comments_id = community.comments.select(:tune_id).distinct

        # render json: @playlists.as_json
        render json: { playlists: @playlists.as_json, comments_id: comments_id.as_json(only: [:tune_id]) }
      end

      # プレイリストの曲をレコメンドする
      def create_recommend
        if @playlist_tune.update(recommend: true)
          @playlists = @community.playlist_tunes.with_recommend.order(added_at: :desc)

          # デバッグ用のログを追加
          Rails.logger.debug { "Filtered playlists: #{@playlists.map(&:attributes)}" }

          Rails.logger.info "Rendering playlist with #{@community.playlist_tunes.count} tunes."
          render json: @playlists.as_json
        else
          render json: @playlist_tune.errors, status: :unprocessable_entity
        end
      end

      # プレイリストの曲をアンレコメンドする
      def destroy_recommend
        if @playlist_tune.update(recommend: false)
          @playlists = @community.playlist_tunes.with_recommend.order(added_at: :desc)

          # デバッグ用のログを追加
          Rails.logger.debug { "Filtered playlists: #{@playlists.map(&:attributes)}" }

          Rails.logger.info "Rendering playlist with #{@community.playlist_tunes.count} tunes."
          render json: @playlists.as_json
        else
          render json: @playlist_tune.errors, status: :unprocessable_entity
        end
      end

      private

      def find_tune_and_community
        @tune = Tune.find_by(id: params[:tune_id])
        @community = Community.find_by(id: params[:community_id])

        if @tune.nil? || @community.nil?
          render json: { error: "Tune or Community not found" }, status: :unprocessable_entity
        end
      end

      def find_playlist_tune
        @playlist_tune = Playlist.find_by(tune_id: @tune.id, community_id: @community.id)

        render json: { error: "Playlist tune not found" }, status: :unprocessable_entity if @playlist_tune.nil?
      end
    end
  end
end
