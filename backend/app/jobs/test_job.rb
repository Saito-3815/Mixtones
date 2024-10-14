require 'get_process_mem'

class TestJob < ApplicationJob
  queue_as :default

  def perform(*_args)
    Rails.logger.info "システム健全性チェック開始"
    memory_usage = GetProcessMem.new.mb
    Rails.logger.info "現在のメモリ使用量：#{memory_usage.round(2)} MB"
    Rails.logger.info "Redisコネクション確認"

    begin
      # 環境に応じてSIDEKIQ_REDIS_URLを設定
      sidekiq_redis_url = Rails.env.production? ? ENV['ELASTICACHE_SIDEKIQ_REDIS_URL'] : ENV['SIDEKIQ_REDIS_URL']
      redis = Redis.new(url: sidekiq_redis_url)

      redis_response = redis.ping
      Rails.logger.info "Redis ping response: #{redis_response}"

      # ハッシュタグを使用してRedisにテストキーとバリューをセット
      test_key = "{test_namespace}:test_key"
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

    # メール送信
    SystemHealthMailer.with(
      memory_usage: memory_usage,
      redis_response: redis_response,
      retrieved_value: retrieved_value
    ).health_check_email.deliver_now
  end
end
