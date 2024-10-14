require_relative "boot"
require "rails/all"
require 'dotenv/load'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Api
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 7.0

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
    config.time_zone = 'Tokyo'
    # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
    config.i18n.default_locale = :ja
    config.i18n.available_locales = [:en, :ja]  # 利用可能なロケールを設定
    config.i18n.load_path += Dir[Rails.root.join('config', 'locales', '**', '*.{rb,yml}').to_s] # ロードパス設定
    # config.eager_load_paths << Rails.root.join("extras")

    # Only loads a smaller set of middleware suitable for API only apps.
    # Middleware like session, flash, cookies can be added back manually.
    # Skip views, helpers and assets when generating a new resource.
    config.api_only = true

    # config.autoload_paths += %W(#{config.root}/lib)
    config.eager_load_paths << Rails.root.join('lib')

    # セッションの設定
    config.middleware.use ActionDispatch::Cookies
    config.middleware.use ActionDispatch::Session::RedisStore

    # Active Record 暗号化キーの設定
    config.active_record.encryption.primary_key = ENV.fetch('PRIMARY_KEY', nil)
    config.active_record.encryption.deterministic_key = ENV.fetch('DETERMINISTIC_KEY', nil)
    config.active_record.encryption.key_derivation_salt = ENV.fetch('KEY_DERIVATION_SALT', nil)
  end
end
