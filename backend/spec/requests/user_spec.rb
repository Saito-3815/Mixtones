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
    # user_paramsのlike_tunesと同じTuneオブジェクトをデータベースに先に追加しておく
    before do
      Tune.create!(
        id: 1,
        name: "test_tune1",
        artist: "test_artist1",
        album: "test_album1",
        images: "test_images1",
        spotify_uri: "test_spotify_uri1",
        preview_url: "test_preview_url1",
        added_at: "test_added_at1"
      )
    end

    let(:user_params) do
      {
        user: {
          name: "test_user",
          avatar: "test_avatar",
          spotify_id: "test_spotify_id",
          # like_tunesのハッシュの配列を作成
          like_tunes: [
            { name: "test_tune1", artist: "test_artist1", album: "test_album1", images: "test_images1",
              spotify_uri: "test_spotify_uri1", preview_url: "test_preview_url1", added_at: "test_added_at1" },
            { name: "test_tune2", artist: "test_artist2", album: "test_album2", images: "test_images2",
              spotify_uri: "test_spotify_uri2", preview_url: "test_preview_url2", added_at: "test_added_at2" },
            { name: "test_tune3", artist: "test_artist3", album: "test_album3", images: "test_images3",
              spotify_uri: "test_spotify_uri3", preview_url: "test_preview_url3", added_at: "test_added_at3" }
          ]
        }
      }
    end

    # 201ステータスコードを返すこと
    it 'creates a user' do
      post '/api/v1/users', params: user_params
      expect(response).to have_http_status(:created)
    end

    # レスポンスがuser.nameの文字列が含まれること
    it 'returns test user' do
      post '/api/v1/users', params: user_params
      expect(response.body).to include("test_user")
    end

    # userオブジェクトに紐づくlike_tunesを追加すること
    it 'creates like_tunes' do
      post '/api/v1/users', params: user_params
      user = User.last
      expect(user.like_tunes.count).to eq 3
    end

    # userオブジェクトに紐づくlike_tunesに既存の重複したtuneオブジェクトが含まれること
    it 'includes tune1' do
      post '/api/v1/users', params: user_params
      user = User.last
      expect(user.like_tunes.pluck(:id)).to include(1)
    end
  end

  # updateアクションのテスト
  describe 'PATCH /api/v1/users/:id' do
    it 'returns 200 status code if user object exists' do
      user = create(:user)
      patch "/api/v1/users/#{user.id}",
            params: { user: { name: 'Test', introduction: 'Test Introduction', avatar: 'Test Avatar' } }
      expect(response).to have_http_status(:ok)
    end

    # userの属性が更新されていること
    it 'updates user name' do
      user = create(:user)
      patch "/api/v1/users/#{user.id}",
            params: { user: { name: 'Test', introduction: 'Test Introduction', avatar: 'Test Avatar' } }
      user.reload
      expect(user.name).to eq 'Test'
    end
  end

  # destroyアクションのテスト
  describe 'DELETE /api/v1/users/:id' do
    let(:user) { create(:user, :with_communities, :with_like_tunes) }

    before do
      delete "/api/v1/users/#{user.id}"
    end

    # 204ステータスコードを返すこと
    it 'returns 204 status code' do
      expect(response).to have_http_status(:ok)
    end

    # userオブジェクトが削除されていること
    it 'deletes a user' do
      expect(User.find_by(id: user.id)).to be_nil
    end

    # userオブジェクトに紐づくmembershipが削除されていること
    it 'deletes memberships' do
      expect(Membership.find_by(user_id: user.id)).to be_nil
    end

    # userオブジェクトに紐づくlikeが削除されていること
    it 'deletes likes' do
      expect(Like.find_by(user_id: user.id)).to be_nil
    end

    # userオブジェクトに紐づくcheckが削除されていること
    it 'deletes checks' do
      expect(Check.find_by(user_id: user.id)).to be_nil
    end

    # userオブジェクトに紐づくcommentが削除されていること
    it 'deletes comments' do
      expect(Comment.find_by(user_id: user.id)).to be_nil
    end
  end
end
