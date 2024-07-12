module Api
  module V1
    class MembershipsController < ApplicationController
      # コミュニティにメンバーを追加
      # Userのlike_tunesをCommunityのplaylist_tunesに追加
      def create
        community = Community.find_by(id: params[:community_id])
        community.update_avatar_url
        user = User.find_by(id: params[:user_id])
        return render json: { error: 'Community or User not found' }, status: :not_found if community.nil? || user.nil?

        @membership = Membership.new(community_id: params[:community_id], user_id: params[:user_id])
        if @membership.save
          community.reload
          # userのspotify_idが'guest_user'でない場合のみplaylistの更新処理を実行
          unless user.spotify_id == 'guest_user'
            add_like_tunes_to_community_playlist(community, user)
          end
          sorted_playlist_tunes = community.playlist_tunes.order('added_at DESC')
          community.update_member_avatars
          user.update_avatar_url
          render json: {
            community: community.as_json(
              include: ['members'],
              methods: [:playlist_tunes_count]).merge(
              playlist_tunes: sorted_playlist_tunes.as_json
            ),
            user: user.as_json(
              except: :refresh_token,
              include: {
                communities: {
                  only: [:id],
                },
                like_tunes: {
                  only: [:id]
                },
                check_tunes: {
                  only: [:id]
                }
              }
            )
          }, status: :created
        else
          render json: @membership.errors, status: :unprocessable_entity
        end
      end

      # コミュニティからメンバーを削除
      # Userのlike_tunesをCommunityのplaylist_tunesから削除
      # Communityのplaylist_tunesに他のmembersの重複していたlike_tunesを追加
      def destroy
        @membership = Membership.find_by(community_id: params[:community_id], user_id: current_user.id)
        community = Community.find_by(id: params[:community_id])
        community.update_avatar_url
        user = current_user
        # current_userがコミュニティメンバーであるか確認
        if community.members.include?(current_user)
          @membership.destroy
          remove_like_tunes_from_playlist(current_user, community) if current_user&.like_tunes.present?
          add_missing_like_tunes_to_playlist(community)
          sorted_playlist_tunes = community.playlist_tunes.order('added_at DESC')

          # コミュニティのメンバーがいなくなった場合、コミュニティを削除
          if community.members.empty?
            community.destroy
            user.update_avatar_url
            render json: {
              message: 'Community and membership successfully deleted.',
              user: user.as_json(
                except: :refresh_token,
                include: {
                  communities: {
                    only: [:id]
                  },
                  like_tunes: {
                    only: [:id]
                  },
                  check_tunes: {
                    only: [:id]
                  }
                }
              )
            }, status: :accepted
          else
            user.update_avatar_url
            community.update_member_avatars
            render json: {
              community: community.as_json(
                include: ['members'],
                methods: [:playlist_tunes_count]
                ).merge(
                playlist_tunes: sorted_playlist_tunes.as_json
              ),
              user: user.as_json(
                except: :refresh_token,
                include: {
                  communities: {
                    only: [:id]
                  },
                  like_tunes: {
                    only: [:id]
                  },
                  check_tunes: {
                    only: [:id]
                  }
                }
              )
            }, status: :ok
          end
        else
          render json: { error: 'User is not a member of this community.' }, status: :unprocessable_entity
        end
      end

      private

      def add_like_tunes_to_community_playlist(community, user)
        spotify_uris = user.like_tunes.pluck(:spotify_uri)
        existing_uris = community.playlist_tunes.where(spotify_uri: spotify_uris).pluck(:spotify_uri)

        (spotify_uris - existing_uris).each do |uri|
          like_tune = user.like_tunes.find_by(spotify_uri: uri)
          Playlist.create(community_id: community.id, tune_id: like_tune.id)
        end
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
