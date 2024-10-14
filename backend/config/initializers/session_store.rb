Rails.application.config.session_store :action_dispatch_session_redis_store,
  servers: [
      {
        url: ENV['REDIS_URL'],
        namespace: 'session',
      }
    ]
# expire_after: 1.hour,
# secure: Rails.env.production? # 本番環境のみHTTPSを使用する（HTTPSだと開発環境でクッキーを確認できないため）
