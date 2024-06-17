Rails.application.config.session_store :action_dispatch_session_redis_store, servers: [ENV['REDIS_URL']],
# expire_after: 1.hour,
secure: Rails.env.production? # 本番環境のみHTTPSを使用する（HTTPSだと開発環境でクッキーを確認できないため）
