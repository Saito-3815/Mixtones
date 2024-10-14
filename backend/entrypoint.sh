#!/bin/bash
set -e

rm -f /api/tmp/pids/server.pid

if [ "$RAILS_ENV" = "production" ]; then
  export RAILS_LOG_TO_STDOUT=true  # ログを標準出力にリダイレクト

  # bundle exec rails db:create RAILS_ENV=production

  bundle exec rails db:migrate RAILS_ENV=production

  # 既存のレコードにデフォルト値を設定するスクリプトを実行
  bundle exec rails runner "Playlist.where(recommend: nil).update_all(recommend: false)"

  # DISABLE_DATABASE_ENVIRONMENT_CHECK=1 bundle exec rails db:reset RAILS_ENV=production
  # Start Unicorn and Sidekiq
  bundle exec unicorn -p 3000 -c /app/config/unicorn.rb -E production &
  bundle exec sidekiq -C /app/sidekiq.yml
fi

exec "$@"