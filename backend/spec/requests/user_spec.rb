require 'rails_helper'

RSpec.describe User, type: :request do
  # showアクションのテスト
  describe 'GET /api/v1/users/:id' do
    let(:user) { create(:user) }

    # userオブジェクトが存在する場合、200ステータスコードを返すこと
    it 'returns 200 status code if user object exists' do
      get "/api/v1/users/#{user.id}"
      expect(response).to have_http_status(:ok)
    end
  end

  # editアクションのテスト
  describe 'GET /api/v1/users/:id/edit' do
    let(:user) { create(:user) }

    # userオブジェクトが存在する場合、200ステータスコードを返すこと
    it 'returns 200 status code if user:user object exists' do
      get "/api/v1/users/#{user.id}/edit"
      expect(response).to have_http_status(:ok)
    end
  end

  # createアクションのテスト
  describe 'POST /api/v1/users' do
    # tuneモデルの配列を作成
    let(:tunes) { create_list(:tune, 5) }

    before do
      post '/api/v1/users', params: {
        user: {
          name: "test_user",
          avatar: "test_avatar",
          spotify_id: "test_spotify_id",
          like_tunes: tunes.map(&:attributes)
        }
      }
    end

    # 201ステータスコードを返すこと
    it 'creates a user' do
      expect(response).to have_http_status(:created)
    end

    # レスポンスがuser.nameの文字列が含まれること
    it 'returns test user' do
      expect(response.body).to include("test_user")
    end

    # userオブジェクトに紐づくlike_tunesを追加すること
    it 'creates like_tunes' do
      user = User.last
      expect(user.like_tunes.count).to eq 5
    end
  end
end
