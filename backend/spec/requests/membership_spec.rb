require 'rails_helper'

RSpec.describe Membership, type: :request do
  # createアクションのテスト
  describe 'POST /api/v1/communities/:id/memberships' do
    let(:user) { create(:user, :with_like_tunes) }
    let(:community) { create(:community) }
    let(:membership_params) do
      {
        user_id: user.id
      }
    end

    # membership_paramsが有効な場合、201ステータスコードを返すこと
    it 'returns 201 status code if membership_params is valid' do
      post "/api/v1/communities/#{community.id}/memberships", params: membership_params
      expect(response).to have_http_status(:created)
    end

    # 指定された user_id または community_id が存在しない場合、404ステータスコードを返すこと
    it 'returns 404 status code if user or community does not exist' do
      post "/api/v1/communities/999/memberships", params: { user_id: 999 }
      expect(response).to have_http_status(:not_found)
    end

    # community.playlist_tunesにuser.like_tunesが含まれること
    it 'includes like_tunes in community.playlist_tunes' do
      post "/api/v1/communities/#{community.id}/memberships", params: membership_params
      community.reload
      expect(community.playlist_tunes.pluck(:id)).to include(*user.like_tunes.pluck(:id))
    end

    # user.like_tunesがcommunity.playlist_tunesに重複して追加されないこと
    it 'does not include duplicate tunes in community.playlist_tunes' do
      community.playlist_tunes << user.like_tunes
      post "/api/v1/communities/#{community.id}/memberships", params: membership_params
      community.reload
      expect(community.playlist_tunes.pluck(:id)).to eq community.playlist_tunes.pluck(:id).uniq
    end
  end

  # destroyアクションのテスト
  describe 'DELETE /api/v1/communities/:community_id/memberships' do
    let(:user) { create(:user, :with_like_tunes) }
    let(:community) { create(:community) }

    before do
      login_with_spotify(user)
      Membership.create(community_id: community.id, user_id: user.id)
    end

    # 204ステータスコードを返すこと
    it 'returns 204 status code' do
      delete "/api/v1/communities/#{community.id}/memberships"
      expect(response).to have_http_status(:ok)
    end

    # community.playlist_tunesにuser.like_tunesが含まれないこと
    it 'does not include like_tunes in community.playlist_tunes' do
      other_user = create(:user, :with_like_tunes)
      Membership.create(community_id: community.id, user_id: other_user.id)
      community.playlist_tunes << user.like_tunes
      delete "/api/v1/communities/#{community.id}/memberships"
      community.reload
      expect(community.playlist_tunes.pluck(:id)).not_to include(*user.like_tunes.pluck(:id))
    end

    # user.like_tunesがcommunity.playlist_tunesから削除されたあと、他のmembersの重複していたlike_tunesが追加されること
    it 'includes missing like_tunes in community.playlist_tunes' do
      other_user = create(:user, :with_like_tunes)
      Membership.create(community_id: community.id, user_id: other_user.id)
      community.playlist_tunes << user.like_tunes
      delete "/api/v1/communities/#{community.id}/memberships"
      community.reload
      expect(community.playlist_tunes.pluck(:id)).to include(*other_user.like_tunes.pluck(:id))
    end

    # コミュニティのメンバーがいなくなった場合、コミュニティが削除されること
    it 'deletes community if there are no members' do
      delete "/api/v1/communities/#{community.id}/memberships"
      expect(Community.find_by(id: community.id)).to be_nil
    end
  end
end
