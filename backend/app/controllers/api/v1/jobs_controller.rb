# backend/app/controllers/api/v1/jobs_controller.rb
module Api
  module V1
    class JobsController < ApplicationController
      def create
        TestJob.perform_later("テストパラメータ")
        render json: { message: 'ジョブをキューに追加しました' }
      end
    end
  end
end
