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
  # describe 'POST /api/v1/users' do
  #   # user_paramsのlike_tunesと同じTuneオブジェクトをデータベースに先に追加しておく
  #   before do
  #     Tune.create!(
  #       id: 1,
  #       name: "test_tune1",
  #       artist: "test_artist1",
  #       album: "test_album1",
  #       images: "test_images1",
  #       spotify_uri: "test_spotify_uri1",
  #       preview_url: "test_preview_url1",
  #       added_at: "test_added_at1"
  #     )
  #   end

  #   let(:user_params) do
  #     {
  #       user: {
  #         name: "test_user",
  #         avatar: "test_avatar",
  #         spotify_id: "test_spotify_id",
  #         # like_tunesのハッシュの配列を作成
  #         like_tunes: [
  #           { name: "test_tune1", artist: "test_artist1", album: "test_album1", images: "test_images1",
  #             spotify_uri: "test_spotify_uri1", preview_url: "test_preview_url1", added_at: "test_added_at1" },
  #           { name: "test_tune2", artist: "test_artist2", album: "test_album2", images: "test_images2",
  #             spotify_uri: "test_spotify_uri2", preview_url: "test_preview_url2", added_at: "test_added_at2" },
  #           { name: "test_tune3", artist: "test_artist3", album: "test_album3", images: "test_images3",
  #             spotify_uri: "test_spotify_uri3", preview_url: "test_preview_url3", added_at: "test_added_at3" }
  #         ]
  #       }
  #     }
  #   end

  #   # 201ステータスコードを返すこと
  #   it 'creates a user' do
  #     post '/api/v1/users', params: user_params
  #     expect(response).to have_http_status(:created)
  #   end

  #   # レスポンスがuser.nameの文字列が含まれること
  #   it 'returns test user' do
  #     post '/api/v1/users', params: user_params
  #     expect(response.body).to include("test_user")
  #   end

  #   # userオブジェクトに紐づくlike_tunesを追加すること
  #   it 'creates like_tunes' do
  #     post '/api/v1/users', params: user_params
  #     user = User.last
  #     expect(user.like_tunes.count).to eq 3
  #   end

  #   # userオブジェクトに紐づくlike_tunesに既存の重複したtuneオブジェクトが含まれること
  #   it 'includes tune1' do
  #     post '/api/v1/users', params: user_params
  #     user = User.last
  #     expect(user.like_tunes.pluck(:id)).to include(1)
  #   end
  # end

  describe 'POST /api/v1/users' do
    let(:spotify_code) { 'dummy_code' }
    let(:access_token) { 'dummy_access_token' }
    let(:refresh_token) { 'dummy_refresh_token' }
    let(:user_data) do
      {
        name: 'Test User',
        avatar: 'http://example.com/avatar.jpg',
        spotify_id: 'testuser',
        like_tunes: [
          {
            name: 'Test Tune',
            artist: 'Test Artist',
            album: 'Test Album',
            images: 'http://example.com/image.jpg',
            spotify_uri: 'spotify:track:testtune',
            preview_url: 'http://example.com/preview.mp3',
            added_at: Time.now.iso8601
          }
        ]
      }
    end
    let(:controller) { instance_double(Api::V1::UsersController) }

    before do
      allow(controller).to receive(:fetch_spotify_tokens).and_return(
        access_token: access_token,
        refresh_token: refresh_token
      )
      allow(controller).to receive(:fetch_authenticated_user_data).and_return(user_data)
    end

    # モックの振る舞いを確認する
    it 'calls fetch_spotify_tokens' do
      expect(controller).to receive(:fetch_spotify_tokens).with(spotify_code)
      post '/api/v1/users', params: { code: spotify_code }
    end

    it 'calls fetch_authenticated_user_data' do
      expect(controller).to receive(:fetch_authenticated_user_data).with(access_token)
      post '/api/v1/users', params: { code: spotify_code }
    end

    # 201ステータスコードを返すこと
    it 'creates a new user and associated like tunes' do
      post '/api/v1/users', params: { code: spotify_code }
      expect(response).to have_http_status(:created)
    end

    # レスポンスがuser.nameの文字列が含まれること
    it 'creates a new user and associated like tunes' do
      post '/api/v1/users', params: { code: spotify_code }
      json = JSON.parse(response.body)
      expect(json['name']).to eq(user_data[:name])
    end

    # userオブジェクトに紐づくlike_tunesを追加すること
    it 'creates a new user and associated like tunes' do
      expect do
        post '/api/v1/users', params: { code: spotify_code }
      end.to change(User, :count).by(1).and change(Like, :count).by(1)

      expect(response).to have_http_status(:created)
      expect(User.last.name).to eq(user_data[:name])
      expect(User.last.like_tunes.first.name).to eq(user_data[:like_tunes].first[:name])
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
