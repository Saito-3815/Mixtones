require 'rails_helper'

RSpec.describe Check, type: :request do
  # indexアクションのテスト
  describe 'GET /api/v1/users/:user_id/checks' do
    let!(:user) { create(:user, :with_check_tunes) }

    # userオブジェクトが存在する場合、200ステータスコードを返すこと
    it 'returns 200 status code if user object exists' do
      get "/api/v1/users/#{user.id}/checks"
      expect(response).to have_http_status(:ok)
    end

    # user.check_tunesを返すこと
    it 'returns user.check_tunes' do
      get "/api/v1/users/#{user.id}/checks"
      json = response.parsed_body
      expect(json.length).to eq(5)
    end
  end

  # createアクションのテスト
  describe 'POST /api/v1/users/:user_id/checks' do
    let(:check_params) { { check: { spotify_uri: "test_spotify_uri" } } }

    before do
      Tune.create({
                    name: "test_tune",
                    artist: "test_artist1",
                    album: "test_album1",
                    images: "test_images",
                    spotify_uri: "test_spotify_uri",
                    added_at: Time.current
                  })
    end

    # userオブジェクトが存在する場合、201ステータスコードを返すこと
    it 'returns 201 status code if user object exists' do
      user = create(:user)
      post "/api/v1/users/#{user.id}/checks", params: check_params
      expect(response).to have_http_status(:created)
    end

    # userオブジェクトが存在しない場合、404ステータスコードを返すこと
    it 'returns 404 status code if user object does not exist' do
      post "/api/v1/users/0/checks", params: check_params
      expect(response).to have_http_status(:not_found)
    end

    # Tuneが存在しない場合、404ステータスコードを返すこと
    it 'returns 404 status code if Tune does not exist' do
      user = create(:user)
      post "/api/v1/users/#{user.id}/checks", params: { check: { spotify_uri: "not_exist_spotify_uri" } }
      expect(response).to have_http_status(:not_found)
    end

    # user.check_tunesにcheck_tuneが追加されること
    it 'adds check_tune to user.check_tunes' do
      user = create(:user)
      post "/api/v1/users/#{user.id}/checks", params: check_params
      user.reload
      expect(user.check_tunes.pluck(:spotify_uri)).to include("test_spotify_uri")
    end
  end

  # destroyアクションのテスト
  describe 'DELETE /api/v1/users/:user_id/checks/:id' do
    # userオブジェクトが存在する場合、200ステータスコードを返すこと
    it 'returns 200 status code if user object exists' do
      user = create(:user, :with_check_tunes)
      delete "/api/v1/users/#{user.id}/checks/#{user.check_tunes.first.id}",
             params: { check: { spotify_uri: user.check_tunes.first.spotify_uri } }
      expect(response).to have_http_status(:ok)
    end

    # userオブジェクトが存在しない場合、404ステータスコードを返すこと
    it 'returns 404 status code if user object does not exist' do
      delete "/api/v1/users/0/checks/0", params: { check: { spotify_uri: "test_spotify_uri" } }
      expect(response).to have_http_status(:not_found)
    end

    # checkが存在しない場合、404ステータスコードを返すこと
    it 'returns 404 status code if check does not exist' do
      user = create(:user)
      delete "/api/v1/users/#{user.id}/checks/0", params: { check: { spotify_uri: "test_spotify_uri" } }
      expect(response).to have_http_status(:not_found)
    end

    # user.check_tunesからcheck_tuneが削除されること
    it 'deletes check_tune from user.check_tunes' do
      user = create(:user, :with_check_tunes)
      uri = user.check_tunes.first.spotify_uri
      delete "/api/v1/users/#{user.id}/checks/#{user.check_tunes.first.id}", params: { check: { spotify_uri: uri } }
      user.reload
      expect(user.check_tunes.pluck(:spotify_uri)).not_to include(uri)
    end
  end
end
