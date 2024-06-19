module UserLogin
  extend ActiveSupport::Concern
  include SpotifyAuth
  include SessionsHelper

  def update_user_and_like_tunes(existing_user, refresh_token, user_create_params)
    existing_user.update!(refresh_token: refresh_token)
    reset_session
    log_in(existing_user)

    user_create_params[:like_tunes].each do |like_tune|
      existing_record = Tune.find_by(spotify_uri: like_tune[:spotify_uri])

      if existing_record.nil?
        existing_user.like_tunes.create!(
          name: like_tune[:name],
          artist: like_tune[:artist],
          album: like_tune[:album],
          images: like_tune[:images],
          spotify_uri: like_tune[:spotify_uri],
          preview_url: like_tune[:preview_url],
          added_at: like_tune[:added_at]
        )
      else
        existing_user.like_tunes << existing_record unless existing_user.like_tunes.exists?(existing_record.id)
      end
    end
    # コントローラーでレスポンスを生成するために必要なデータを返す
    { user: existing_user, session_id: session[:session_id] }
  end
end
