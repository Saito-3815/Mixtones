require 'sidekiq'
require 'sidekiq-cron'

if Rails.env.production?
  require 'redis'
  REDIS_URL = ENV['ELASTICACHE_SIDEKIQ_REDIS_URL']
  Sidekiq.configure_server do |config|
    config.redis = { url: REDIS_URL }
    config.client_middleware do |chain|
      chain.add SidekiqUniqueJobs::Middleware::Client
    end
    config.server_middleware do |chain|
      chain.add SidekiqUniqueJobs::Middleware::Server
    end
    SidekiqUniqueJobs::Server.configure(config)
  end

  Sidekiq.configure_client do |config|
    config.redis = { url: REDIS_URL }
    config.client_middleware do |chain|
      chain.add SidekiqUniqueJobs::Middleware::Client
    end
  end

  SidekiqUniqueJobs.configure do |config|
    config.enabled = true
    config.lock_ttl = 1.hour
    config.lock_info = true
  end
else
  # 開発環境とテスト環境用の設定
  redis_url = ENV['SIDEKIQ_REDIS_URL'] || 'redis://localhost:6379/0'
  Sidekiq.configure_server do |config|
    config.redis = { url: redis_url }
  end
  Sidekiq.configure_client do |config|
    config.redis = { url: redis_url }
  end
end

# 共通の設定
Sidekiq.configure_server do |config|
  config.on(:startup) do
    schedule_file = "config/schedule.yml"
    if File.exist?(schedule_file)
      Sidekiq::Cron::Job.load_from_hash YAML.load_file(schedule_file)
    end
  end
end

if Rails.env.test?
  require 'sidekiq/testing'
  Sidekiq::Testing.fake!
end
