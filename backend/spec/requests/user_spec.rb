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
    let(:spotify_code) { Base64.encode64('dummy_code') }
    let(:code_verifier) { 'dummy_code_verifier' }
    let(:is_persistent) { false }
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

      # データベースにuser_create_paramsと同じtuneオブジェクトを追加しておく
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

    after do
      delete "/api/v1/sessions"
    end

    # 201ステータスコードを返すこと
    it 'creates the user' do
      post '/api/v1/users',
           params: { user: { code: spotify_code, code_verifier: code_verifier, is_persistent: is_persistent } }
      puts response.body # レスポンスボディを出力
      puts response.status # ステータスコードを出力
      expect(response).to have_http_status(:created)
    end

    # レスポンスがuser.nameの文字列が含まれること
    it 'creates a new user and has user.name' do
      post '/api/v1/users',
           params: { user: { code: spotify_code, code_verifier: code_verifier, is_persistent: is_persistent } }
      json = response.parsed_body
      expect(json['user']['name']).to eq(user_create_params[:name])
    end

    # userオブジェクトに紐づくlike_tunesを追加すること
    it 'increase user $ like counts' do
      expect do
        post '/api/v1/users',
             params: { user: { code: spotify_code, code_verifier: code_verifier, is_persistent: is_persistent } }
      end.to change(User, :count).by(1)
    end

    it 'creates user has name of user data' do
      post '/api/v1/users',
           params: { user: { code: spotify_code, code_verifier: code_verifier, is_persistent: is_persistent } }
      expect(User.last.name).to eq(user_create_params[:name])
    end

    it 'creates a new like_tunes' do
      post '/api/v1/users',
           params: { user: { code: spotify_code, code_verifier: code_verifier, is_persistent: is_persistent } }
      expect(User.last.like_tunes.first.name).to eq(user_create_params[:like_tunes].first[:name])
    end

    # userオブジェクトに紐づくlike_tunesを追加すること
    it 'creates like_tunes' do
      post '/api/v1/users',
           params: { user: { code: spotify_code, code_verifier: code_verifier, is_persistent: is_persistent } }
      user = User.last
      expect(user.like_tunes.count).to eq 3
    end

    # userオブジェクトに紐づくlike_tunesに既存の重複したtuneオブジェクトが含まれること
    it 'includes tune1' do
      post '/api/v1/users',
           params: { user: { code: spotify_code, code_verifier: code_verifier, is_persistent: is_persistent } }
      user = User.last
      expect(user.like_tunes.pluck(:id)).to include(1)
    end

    # 新規ユーザーがログインしていること
    it 'logs in the new user' do
      post '/api/v1/users',
           params: { user: { code: spotify_code, code_verifier: code_verifier, is_persistent: is_persistent } }
      expect(session[:user_id]).to eq User.last.id
    end

    # is_persistentがfalseの場合、セッションの有効期限がnilに設定されていること
    it 'sets the session expiration to nil if is_persistent is false' do
      post '/api/v1/users',
           params: { user: { code: spotify_code, code_verifier: code_verifier, is_persistent: is_persistent } }
      expect(request.session_options[:expire_after]).to eq(1.hour)
    end

    # 永続的セッションの場合、セッションの有効期限が30日に設定されていること
    it 'sets the session expiration to 30 days if the session is persistent' do
      is_persistent = true
      post '/api/v1/users',
           params: { user: { code: spotify_code, code_verifier: code_verifier, is_persistent: is_persistent } }
      expect(request.session_options[:expire_after]).to eq 30.days
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
    # テスト用のパラメータとモックをセットアップ
    # include_context 'when session is setup'

    let!(:user) { create(:user, :with_communities, :with_like_tunes) }

    # before do
    #   post '/api/v1/sessions',
    #        params: { user: { code: spotify_code, code_verifier: code_verifier, is_persistent: is_persistent } }
    # end

    # 204ステータスコードを返すこと
    it 'returns 204 status code' do
      delete "/api/v1/users/#{user.id}"
      expect(response).to have_http_status(:ok)
    end

    # userオブジェクトが削除されていること
    it 'deletes a user' do
      delete "/api/v1/users/#{user.id}"
      expect(User.find_by(id: user.id)).to be_nil
    end

    # userオブジェクトに紐づくmembershipが削除されていること
    it 'deletes memberships' do
      delete "/api/v1/users/#{user.id}"
      expect(Membership.find_by(user_id: user.id)).to be_nil
    end

    # userオブジェクトに紐づくlikeが削除されていること
    it 'deletes likes' do
      delete "/api/v1/users/#{user.id}"
      expect(Like.find_by(user_id: user.id)).to be_nil
    end

    # userオブジェクトに紐づくcheckが削除されていること
    it 'deletes checks' do
      delete "/api/v1/users/#{user.id}"
      expect(Check.find_by(user_id: user.id)).to be_nil
    end

    # userオブジェクトに紐づくcommentが削除されていること
    it 'deletes comments' do
      delete "/api/v1/users/#{user.id}"
      expect(Comment.find_by(user_id: user.id)).to be_nil
    end

    # セッションが削除されていること
    # it 'deletes the session' do
    #   delete "/api/v1/users/#{user.id}"
    #   expect(session[:user_id]).to be_nil
    # end
  end
end
