require 'rails_helper'

RSpec.describe User, type: :request do
  # createアクションのテスト
  describe 'POST /api/v1/sessions' do
    let(:spotify_code) { Base64.encode64('dummy_code') }
    let(:code_verifier) { 'dummy_code_verifier' }
    let(:access_token) { 'dummy_access_token' }
    let(:refresh_token) { 'dummy_refresh_token' }
    let(:user_create_params) do
      {
        name: 'Test User',
        avatar: 'http://example.com/avatar.jpg',
        spotify_id: 'testuser',
        like_tunes: []
      }
    end

    before do
      # SpotifyAuthモジュールのメソッドをモック化
      allow(SpotifyAuth).to receive(:fetch_spotify_tokens).with('dummy_code', 'dummy_code_verifier').and_return(
        access_token: access_token,
        refresh_token: refresh_token
      )
      allow(SpotifyAuth).to receive(:fetch_authenticated_user_data).with(access_token).and_return(user_create_params)
      allow(SpotifyAuth).to receive(:fetch_saved_tracks).with('testuser', access_token, user_create_params) do
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
      # データベースにuser_create_paramsと同じユーザーオブジェクトを追加しておく
      tune = Tune.create!(
        name: "test_tune1",
        artist: "test_artist1",
        album: "test_album1",
        images: "test_images1",
        spotify_uri: "test_spotify_uri1",
        preview_url: "test_preview_url1",
        added_at: "test_added_at1"
      )
      User.create!(
        id: 1,
        name: "Test User",
        avatar: "http://example.com/avatar.jpg",
        spotify_id: "testuser",
        refresh_token: "old_token",
        like_tunes: [tune]
      )

      # データベースにuser_create_paramsと同じtuneオブジェクトを追加しておく
      # Tune.create!(
      #   id: 1,
      #   name: "test_tune1",
      #   artist: "test_artist1",
      #   album: "test_album1",
      #   images: "test_images1",
      #   spotify_uri: "test_spotify_uri1",
      #   preview_url: "test_preview_url1",
      #   added_at: "test_added_at1"
      # )
    end
    # ユーザーオブジェクトが存在する場合、200ステータスコードを返すこと
    it 'returns 200 status code if user object exists' do
      post '/api/v1/sessions', params: { user: { code: spotify_code, code_verifier: code_verifier } }
      expect(response).to have_http_status(:ok)
    end
  end
end
