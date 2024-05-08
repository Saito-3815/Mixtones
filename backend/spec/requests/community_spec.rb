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
    let(:user) { create(:user) }
    
    before do
      post '/api/v1/communities', params: { user_name: user.name }
    end

    # communityオブジェクトに紐づくmembershipを作成すること
    it 'creates a membership' do
      expect(Membership.count).to eq 1
    end

    # 201ステータスコードを返すこと
    it 'creates a community' do
      expect(response).to have_http_status(:created)
    end

    # レスポンスがuser.nameのコミュニティの文字列が含まれること
    it 'returns test community' do
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
end
