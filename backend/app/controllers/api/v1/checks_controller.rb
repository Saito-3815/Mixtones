module Api
  module V1
    class ChecksController < ApplicationController
      include RenderUserJson

      # ユーザーのチェックした曲を新しい順に取得
      def index
        user = User.find(params[:user_id])
        if user&.check_tunes.present?
          @check = user.check_tunes.order(id: :desc)
          render json: @check, status: :ok
        else
          render json: { message: 'No check tunes' }, status: :not_found
        end
      end

      # チェックした曲を受け取り、user.check_tunesに追加
      def create
        user = User.find_by(id: params[:user_id])
        return render json: { message: 'User not found' }, status: :not_found if user.nil?

        existing_record = Tune.find_by(spotify_uri: check_params[:spotify_uri])
        return render json: { message: 'Tune not found' }, status: :not_found if existing_record.nil?

        user.check_tunes << existing_record

        render json: { user: user.as_json(
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
        ), message: 'Check tune added' }, status: :created
      end

      # チェックした曲をuser.check_tunesから削除
      def destroy
        user = User.find_by(id: params[:user_id])
        return render json: { message: 'User not found' }, status: :not_found if user.nil?

        check = user.check_tunes.find_by(spotify_uri: check_params[:spotify_uri])
        return render json: { message: 'Check tune not found' }, status: :not_found if check.nil?

        user.check_tunes.delete(check)

        render json: { message: 'Check tune deleted' }, status: :ok
      end

      private

      def check_params
        params.require(:check).permit(:spotify_uri)
      end
    end
  end
end
