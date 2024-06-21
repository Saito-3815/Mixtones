require 'redis'

class RedisClient
  def self.current
    @redis ||= Redis.new(url: ENV['REDIS_URL'])
  end
end
