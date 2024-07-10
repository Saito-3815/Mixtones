require 'rails_helper'

RSpec.describe Community, type: :request do
  # indexアクションのテスト
  describe 'GET /api/v1/communities' do
    # communityオブジェクトが存在する場合、200ステータスコードを返すこと
    it 'returns 200 status code if community object exists' do
      get '/api/v1/communities'
      expect(response).to have_http_status(:ok)
    end
  end

  # createアクションのテスト
  describe 'POST /api/v1/communities' do
    let(:user) { create(:user, :with_like_tunes) }

    before do
      login_with_spotify(user)
    end

    # communityオブジェクトに紐づくmembershipを作成すること
    it 'creates a membership' do
      post '/api/v1/communities'
      community = Community.last
      expect(community.members.count).to eq 1
    end

    # communityオブジェクトに紐づくplaylistにlike_tunesを追加すること
    it 'creates a playlist' do
      post '/api/v1/communities'
      community = Community.last
      expect(community.playlist_tunes.count).to eq user.like_tunes.count
    end

    # 201ステータスコードを返すこと
    it 'creates a community' do
      post '/api/v1/communities'
      expect(response).to have_http_status(:created)
    end

    # レスポンスがuser.nameのコミュニティの文字列が含まれること
    it 'returns test community' do
      post '/api/v1/communities'
      expect(response.body).to include("#{user.name}のコミュニティ")
    end
  end

  # showアクションのテスト
  describe 'GET /api/v1/communities/:id' do
    let(:community) { create(:community) }

    # communityオブジェクトが存在する場合、200ステータスコードを返すこと
    it 'returns 200 status code if community object exists' do
      get "/api/v1/communities/#{community.id}"
      expect(response).to have_http_status(:ok)
    end
  end

  # editアクションのテスト
  describe 'GET /api/v1/communities/:id/edit' do
    let(:community) { create(:community) }

    # communityオブジェクトが存在する場合、200ステータスコードを返すこと
    it 'returns 200 status code if community object exists' do
      get "/api/v1/communities/#{community.id}/edit"
      expect(response).to have_http_status(:ok)
    end
  end

  # updateアクションのテスト
  describe 'PATCH /api/v1/communities/:id' do
    let(:user) { create(:user) }
    let(:community) { create(:community) }
    let(:membership_params) do
      {
        user_id: user.id
      }
    end

    # current_userをコミュニティに参加
    before do
      login_with_spotify(user)
      post "/api/v1/communities/#{community.id}/memberships", params: membership_params
    end

    it 'returns 200 status code if community object exists' do
      patch "/api/v1/communities/#{community.id}",
            params: { community: {
              name: 'Test',
              introduction: 'Test Introduction',
              avatar: 'Test Avatar',
              playlist_name: 'Test Playlist'
            } }
      expect(response).to have_http_status(:ok)
    end

    # communityオブジェクトの属性を更新すること
    it 'updates a community' do
      patch "/api/v1/communities/#{community.id}",
            params: { community: {
              name: 'Test',
              introduction: 'Test Introduction',
              avatar: 'Test Avatar',
              playlist_name: 'Test Playlist'
            } }
      community.reload
      expect(community.name).to eq 'Test'
    end
  end

  # destroyアクションのテスト
  describe 'DELETE /api/v1/communities/:id' do
    let(:community) { create(:community, :with_members, :with_playlist_tunes) }

    before do
      delete "/api/v1/communities/#{community.id}"
    end

    it 'returns 204 status code if community object exists' do
      expect(response).to have_http_status(:no_content)
    end

    # communityオブジェクトを削除すること
    it 'deletes a community' do
      expect(Community.find_by(id: community)).to be_nil
    end

    # communityオブジェクトに紐づくmembershipを削除すること
    it 'deletes a membership' do
      expect { community.destroy }.to change(Membership, :count).by(-community.members.count)
    end

    # communityオブジェクトに紐づくplaylistを削除すること
    it 'deletes a playlist' do
      expect { community.destroy }.to change(Playlist, :count).by(-community.playlist_tunes.count)
    end

    # communityオブジェクトに紐づくcommentを削除すること
    it 'deletes a comment' do
      expect { community.destroy }.to change(Comment, :count).by(-community.comments.count)
    end
  end
end
