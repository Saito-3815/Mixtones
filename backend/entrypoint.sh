#!/bin/bash
set -e

rm -f /api/tmp/pids/server.pid

# bundle exec rails db:create RAILS_ENV=production

bundle exec rails db:migrate RAILS_ENV=production

# DISABLE_DATABASE_ENVIRONMENT_CHECK=1 bundle exec rails db:reset RAILS_ENV=production

exec "$@"