module Api
  module V1
    class CommentsController < ApplicationController
      # コミュニティプレイリストの曲に対するコメントを新しい順に取得
      def index
        comments = Comment.where(
          community_id: params[:community_id],
          tune_id: params[:tune_id]
        ).order(created_at: :asc).all
        # コメントのuserのavatarをs3のURLに変換
        comments.each do |comment|
          if comment.user.avatar.present? && comment.user.avatar.match?(%r{^uploads/[a-f0-9\-]+/[^/]+$})
            comment.user.avatar = comment.user.generate_s3_url(comment.user.avatar)
          end
        end

        render json: {
          comments: comments.as_json(
            only: [:id, :body, :created_at],
            include: { user: { only: [:id, :name, :avatar] } }
          )
        }, status: :ok
      end

      # コミュニティプレイリストの曲に対するコメントを作成し、既存と一緒に新しい順に取得
      def create
        comment = Comment.new(
          community_id: params[:community_id],
          user_id: params[:user_id],
          tune_id: params[:tune_id],
          body: comment_params[:body]
        )
        if comment.save
          comments = Comment.where(
            community_id: params[:community_id],
            tune_id: params[:tune_id]
          ).order(created_at: :asc).all

          comments.each do |comment|
            if comment.user.avatar.present? && comment.user.avatar.match?(%r{^uploads/[a-f0-9\-]+/[^/]+$})
              comment.user.avatar = comment.user.generate_s3_url(comment.user.avatar)
            end
          end

          community = Community.find(params[:community_id])
          comments_id = community.comments.select(:tune_id).distinct

          render json: {
            comments: comments.as_json(only: [:id, :body, :created_at],
                                       include: { user: { only: [:id, :name,
                                                                 :avatar] } }),
            comments_id: comments_id.as_json(only: [:tune_id])
          }, status: :created
        else
          render json: { message: 'Comment not created' }, status: :bad_request
        end
      end

      # コミュニティプレイリストの曲に対するコメントを削除し、既存の残りを新しい順に取得
      def destroy
        comment = Comment.find_by(
          community_id: params[:community_id],
          user_id: params[:user_id],
          tune_id: params[:tune_id],
          id: params[:id]
        )
        if comment.nil?
          render json: { message: 'Comment not found' }, status: :not_found
        else
          comment.destroy
          comments = Comment.where(
            community_id: params[:community_id],
            tune_id: params[:tune_id]
          ).order(created_at: :asc).all
          render json: comments, only: [:id, :body, :created_at], include: { user: { only: [:id, :name, :avatar] } },
                 status: :ok
        end
      end

      private

      def comment_params
        params.require(:comment).permit(:body)
      end
    end
  end
end
