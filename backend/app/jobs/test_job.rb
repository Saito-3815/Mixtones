require 'get_process_mem'

class TestJob < ApplicationJob
  queue_as :default

  def perform(*_args)
    # sleep 5 # ジョブの実行時間を設定

    Rails.logger.info "システム健全性チェック開始"

    memory_usage = GetProcessMem.new.mb
    Rails.logger.info "現在のメモリ使用量：#{memory_usage.round(2)} MB"

    Rails.logger.info "Redisコネクション確認"
    begin
      redis = Redis.new(url: ENV.fetch('SIDEKIQ_REDIS_URL', nil))
      redis_response = redis.ping
      Rails.logger.info "Redis ping response: #{redis_response}"

      # Redisにテストキーとバリューをセット
      test_key = "test_key"
      test_value = "test_value"
      redis.set(test_key, test_value)
      Rails.logger.info "Redisにセットしたキー: #{test_key}, バリュー: #{test_value}"

      # セットしたキーのバリューを取得して確認
      retrieved_value = redis.get(test_key)
      Rails.logger.info "Redisから取得したバリュー: #{retrieved_value}"
    rescue StandardError => e
      Rails.logger.error "Redis操作に失敗しました: #{e.message}"
    end

    Rails.logger.info "システム健全性チェック完了"
  end
end
