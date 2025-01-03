module Api
  module V1
    class ImagesController < ApplicationController
      def create
        s3_client = Aws::S3::Client.new
        signer = Aws::S3::Presigner.new(client: s3_client)

        filename = params[:filename]

        presigned_url = signer.presigned_url(:put_object, bucket: ENV.fetch('S3_BUCKET_NAME', nil),
                                                          key: "uploads/#{SecureRandom.uuid}/#{filename}")

        render json: { url: presigned_url }
      end
    end
  end
end
