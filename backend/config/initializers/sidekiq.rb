# config/initializers/sidekiq.rb
require 'sidekiq'
require 'sidekiq-scheduler'
require 'yaml'

Sidekiq.configure_server do |config|
  config.redis = { url: ENV['SIDEKIQ_REDIS_URL'] }
  config.on(:startup) do
    schedule_file = File.expand_path('../../sidekiq.yml', __dir__)
    if File.exist?(schedule_file)
      schedule = YAML.load_file(schedule_file)
      # Sidekiq.logger.info "Loaded schedule: #{schedule.inspect}" # デバッグ用のログを追加
      if schedule.is_a?(Hash)
        Sidekiq.schedule = schedule[:schedule]
        Sidekiq::Scheduler.reload_schedule!
      else
        Sidekiq.logger.warn "Invalid schedule format in #{schedule_file}"
      end
    else
      Sidekiq.logger.warn "No such file or directory @ rb_check_realpath_internal - #{schedule_file}"
    end
  end
end

Sidekiq.configure_client do |config|
  config.redis = { url: ENV['SIDEKIQ_REDIS_URL'] }
end
