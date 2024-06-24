module SessionsHelper
  def log_in(user)
    session[:user_id] = user.id
  end

  def log_out
    session_id = session[:user_id]
    redis = Redis.new(url: ENV.fetch('REDIS_URL', nil))
    session_key = "session:#{session_id}"
    redis.del(session_key)
    reset_session
  end

  def current_user
    @current_user ||= User.find_by(id: session[:user_id])
  end

  # def logged_in?(user)
  #   session[:user_id] == user.id
  # end

  def logged_in?(user)
    user.last_active_at && user.last_active_at > 60.minutes.ago
  end
end
