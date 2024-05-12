require 'rails_helper'

RSpec.describe Membership, type: :request do
  # createアクションのテスト
  describe 'POST /api/v1/communities/:community_id/memberships' do
    let(:user) { create(:user, :with_like_tunes) }
    let(:community) { create(:community) }
    let(:membership_params) do
      {
        community_id: community.id,
        user_id: user.id
      }
    end

    # membership_paramsが有効な場合、201ステータスコードを返すこと
    it 'returns 201 status code if membership_params is valid' do
      post "/api/v1/communities/#{community.id}/memberships", params: membership_params
      expect(response).to have_http_status(:created)
    end

    # membership_paramsが無効な場合、422ステータスコードを返すこと
    it 'returns 422 status code if membership_params is invalid' do
      post "/api/v1/communities/#{community.id}/memberships", params: { community_id: community }
      expect(response).to have_http_status(:unprocessable_entity)
    end

    # community.playlist_tunesにuser.like_tunesが含まれること
    it 'includes like_tunes in community.playlist_tunes' do
      post "/api/v1/communities/#{community.id}/memberships", params: membership_params
      community.reload
      expect(community.playlist_tunes.pluck(:id)).to include(*user.like_tunes.pluck(:id))
    end

    # user.like_tunesがcommunity.playlist_tunesに重複して追加されないこと
    it 'does not include duplicate tunes in community.playlist_tunes' do
      post "/api/v1/communities/#{community.id}/memberships", params: membership_params
      community.reload
      expect(community.playlist_tunes.pluck(:id)).to eq community.playlist_tunes.pluck(:id).uniq
    end
  end
end
