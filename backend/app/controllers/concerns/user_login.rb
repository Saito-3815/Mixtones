module UserLogin
  extend ActiveSupport::Concern
  include SpotifyAuth
  include SessionsHelper

  def update_user_and_like_tunes(existing_user, refresh_token, user_create_params)
    existing_user.update!(refresh_token: refresh_token)
    reset_session
    log_in(existing_user)

    # like_tunesのimagesデータを最初のURLのみに加工
    extract_first_image_url(user_create_params[:like_tunes])

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
          added_at: like_tune[:added_at],
          time: like_tune[:time],
          external_url: like_tune[:external_url]
        )
      else
        existing_user.like_tunes << existing_record unless existing_user.like_tunes.exists?(existing_record.id)
      end
    end
    # コントローラーでレスポンスを生成するために必要なデータを返す
    { user: existing_user, session_id: session[:session_id] }
  end

  private

  def extract_first_image_url(like_tunes)
    like_tunes.each do |like_tune|
      first_image_url = like_tune[:images].first["url"]
      like_tune[:images] = first_image_url # 配列ではなく単一の文字列として保存
    end
  end
end
