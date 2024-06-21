module SessionsHelper
  def log_in(user)
    session[:user_id] = user.id
  end

  def log_out
    session_id = session[:user_id]
    redis = Redis.new(url: ENV['REDIS_URL'])
    session_key = "session:#{session_id}"
    redis.del(session_key)
    reset_session
  end

  def current_user
    @current_user ||= User.find_by(id: session[:user_id])
  end
end
