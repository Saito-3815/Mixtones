module S3Presignable
  extend ActiveSupport::Concern

  # データベースのkeyから画像のURLを生成
  def generate_s3_url(key)
    s3_client = Aws::S3::Client.new
    signer = Aws::S3::Presigner.new(client: s3_client)
    signer.presigned_url(:get_object, bucket: ENV.fetch('S3_BUCKET_NAME', nil), key: key, expires_in: 7200)
  end
end
