module Api
  module V1
    class LikesController < ApplicationController
      # 新しいお気に入り曲を受け取り、user.like_tunesとuserが所属するコミュニティのプレイリストに保存
      # 既存ユーザーのログイン時とstateの更新時に呼び出される
      def create
        # userオブジェクトが存在する場合、user.like_tunesにlike_tunesを追加
        user = User.find(params[:user_id])
        if user&.like_tunes.present?
          # user.like_tunesにlike_tunesと重複しているレコードが無ければ追加
          like_params[:like_tunes].each do |like_tune|
            existing_record = user.like_tunes.find_by(spotify_uri: like_tune[:spotify_uri])

            # existing_recordがnilでないならすれば処理をスキップする
            next unless existing_record.nil?

            user.like_tunes.create!(
              name: like_tune[:name],
              artist: like_tune[:artist],
              album: like_tune[:album],
              images: like_tune[:images],
              spotify_uri: like_tune[:spotify_uri],
              preview_url: like_tune[:preview_url],
              added_at: like_tune[:added_at]
            )
          end
          # user.like_tunesをuserが所属するcommunityのplaylist_tunesに追加
          add_like_tunes_to_playlist(user)
        end
        # @likeに追加したlike_tunesを返す
        @like = user.like_tunes
        render json: @like, status: :created
      end

      # ユーザーの最新のお気に入り曲を取得
      def latest
        user = User.find(params[:user_id])
        # user.like_tunesのadded_atが最新のものを取得
        @like = user.like_tunes.order(added_at: :desc).first
        render json: @like
      end

      private

      def like_params
        params.require(:like).permit(
          :user_id,
          like_tunes: [:name, :artist, :album, :images, :spotify_uri, :preview_url, :added_at]
        )
      end

      # user.like_tunesをuserが所属するcommunityのplaylist_tunesに追加
      def add_like_tunes_to_playlist(user)
        user.communities.each do |community|
          existing_records = community.playlist_tunes.where(spotify_uri: user.like_tunes.pluck(:spotify_uri))

          # whereメソッドは結果が空でもnilを返さない(nil?は常にfalse)
          # そのため、empty?メソッドを使用
          community.playlist_tunes << user.like_tunes if existing_records.empty?
          community.save!
        end
      end
    end
  end
end
