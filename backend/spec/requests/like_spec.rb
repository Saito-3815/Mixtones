require 'rails_helper'

RSpec.describe Like, type: :request do
  # createアクションのテスト
  describe 'POST /api/v1/users/:user_id/likes' do
    let!(:user) { create(:user, :with_like_tunes, :with_communities) }
    let(:like_params) do
      { like: {
        user_id: user.id,
        like_tunes: [
          { name: "test_tune1", artist: "test_artist1", album: "test_album1", images: "test_images1",
            spotify_uri: "test_spotify_uri1", preview_url: "test_preview_url1", added_at: "test_added_at1" },
          { name: "test_tune2", artist: "test_artist2", album: "test_album2", images: "test_images2",
            spotify_uri: "test_spotify_uri2", preview_url: "test_preview_url2", added_at: "test_added_at2" },
          { name: "test_tune3", artist: "test_artist3", album: "test_album3", images: "test_images3",
            spotify_uri: "test_spotify_uri3", preview_url: "test_preview_url3", added_at: "test_added_at3" }
        ]
      } }
    end

    # userオブジェクトが存在する場合、201ステータスコードを返すこと
    it 'returns 201 status code if user object exists' do
      post "/api/v1/users/#{user.id}/likes", params: like_params
      expect(response).to have_http_status(:created)
    end

    # user.like_tunesにlike_tunesが追加されること
    it 'adds like_tunes to user.like_tunes' do
      post "/api/v1/users/#{user.id}/likes", params: like_params
      user.reload
      expect(user.like_tunes.pluck(:spotify_uri)).to include(
        "test_spotify_uri1",
        "test_spotify_uri2",
        "test_spotify_uri3"
      )
    end

    # user.like_tunesがcommunity.playlist_tunesに追加されること
    it 'adds like_tunes to community.playlist_tunes' do
      post "/api/v1/users/#{user.id}/likes", params: like_params
      user.communities.each do |community|
        community.reload
        expect(community.playlist_tunes.pluck(:spotify_uri)).to include(
          "test_spotify_uri1",
          "test_spotify_uri2",
          "test_spotify_uri3"
        )
      end
    end
  end

  # latestアクションのテスト
  describe 'GET /api/v1/users/:user_id/likes/latest' do
    let!(:user) { create(:user, :with_like_tunes) }

    # userオブジェクトが存在する場合、200ステータスコードを返すこと
    it 'returns 200 status code if user object exists' do
      get "/api/v1/users/#{user.id}/likes/latest"
      expect(response).to have_http_status(:ok)
    end

    # user.like_tunesの最新のlike_tuneを返すこと
    it 'returns the latest like_tune in user.like_tunes' do
      get "/api/v1/users/#{user.id}/likes/latest"
      expect(response.body).to include user.like_tunes.order(added_at: :desc).first.spotify_uri
    end
  end
end
