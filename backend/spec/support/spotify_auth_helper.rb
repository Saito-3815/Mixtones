module SpotifyAuthHelper
  def login_with_spotify(user)
    spotify_code = Base64.encode64('dummy_code')
    code_verifier = 'dummy_code_verifier'
    is_persistent = false
    access_token = 'dummy_access_token'
    refresh_token = 'dummy_refresh_token'
    user_create_params = {
      name: user.name,
      avatar: user.avatar,
      spotify_id: user.spotify_id,
      like_tunes: []
    }

    allow(SpotifyAuth).to receive(:fetch_spotify_tokens).with('dummy_code', 'dummy_code_verifier').and_return(
      access_token: access_token,
      refresh_token: refresh_token
    )
    allow(SpotifyAuth).to receive(:fetch_authenticated_user_data).with(access_token).and_return(user_create_params)
    allow(SpotifyAuth).to receive(:fetch_saved_tracks).with(user.spotify_id, access_token, user_create_params) do
      user_create_params[:like_tunes] = [
        { name: "test_tune1", artist: "test_artist1", album: "test_album1", images: "test_images1",
            spotify_uri: "test_spotify_uri1", preview_url: "test_preview_url1", added_at: "test_added_at1" },
          { name: "test_tune2", artist: "test_artist2", album: "test_album2", images: "test_images2",
            spotify_uri: "test_spotify_uri2", preview_url: "test_preview_url2", added_at: "test_added_at2" },
          { name: "test_tune3", artist: "test_artist3", album: "test_album3", images: "test_images3",
            spotify_uri: "test_spotify_uri3", preview_url: "test_preview_url3", added_at: "test_added_at3" }
      ]
      user_create_params
    end

    post '/api/v1/sessions', params: { user: { code: spotify_code, code_verifier: code_verifier, is_persistent: is_persistent } }
  end
end
