require 'rails_helper'

RSpec.describe Comment, type: :request do
  # indexアクションのテスト
  describe 'GET /api/v1/comments/community_id/:user_id/:tune_id' do
    let!(:community) { create(:community, :with_comments) }
    # let!(:user) { create(:user, :with_comments) }
    # let!(:tune) { create(:tune) }

    # userオブジェクトが存在する場合、200ステータスコードを返すこと
    it 'returns 200 status code if user object exists' do
      get "/api/v1/comments/#{community.id}/#{community.comments[0].user.id}/#{community.comments[0].tune.id}"
      expect(response).to have_http_status(:ok)
    end

    # user.commentsを返すこと
    it 'returns user.comments' do
      get "/api/v1/comments/#{community.id}/#{community.comments[0].user.id}/#{community.comments[0].tune.id}"
      json = response.parsed_body
      expect(json.length).to eq(5)
    end
  end
end
