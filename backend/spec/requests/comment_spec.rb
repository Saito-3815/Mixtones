require 'rails_helper'

RSpec.describe Comment, type: :request do
  # indexアクションのテスト
  describe 'GET /api/v1/communities/community_id/tunes/:tune_id/comments' do
    let!(:community) { create(:community, :with_comments) }

    # userオブジェクトが存在する場合、200ステータスコードを返すこと
    it 'returns 200 status code if user object exists' do
      get "/api/v1/communities/#{community.id}/tunes/#{community.comments[0].tune.id}/comments"
      expect(response).to have_http_status(:ok)
    end

    # user.nameを返すこと
    it 'returns user.name' do
      get "/api/v1/communities/#{community.id}/tunes/#{community.comments[0].tune.id}/comments"
      json = response.parsed_body
      comments = json['comments']
      expect(comments[0]['user']['name']).to eq(community.comments[0].user.name)
    end
  end

  # createアクションのテスト
  describe 'POST /api/v1/communities/community_id/tunes/:tune_id/users/uer_id/comments' do
    let!(:community) { create(:community, :with_members, :with_playlist_tunes) }

    # コメントが作成された場合、201ステータスコードを返すこと
    it 'returns 201 status code if comment is created' do
      post "/api/v1/communities/#{community.id}/tunes/#{community.playlist_tunes[0].id}" \
           "/users/#{community.members[0].id}/comments",
           params: { comment: { body: 'test' } }
      expect(response).to have_http_status(:created)
    end

    # コメントが作成されなかった場合、400ステータスコードを返すこと
    it 'returns 400 status code if comment is not created' do
      post "/api/v1/communities/#{community.id}/tunes/#{community.playlist_tunes[0].id}" \
           "/users/#{community.members[0].id}/comments",
           params: { comment: { body: '' } }
      expect(response).to have_http_status(:bad_request)
    end

    # 複数のuserがコメントを作成した場合
    context 'when multiple users create comments' do
      before do
        post "/api/v1/communities/#{community.id}/tunes/#{community.playlist_tunes[0].id}" \
             "/users/#{community.members[0].id}/comments",
             params: { comment: { body: 'test' } }
        post "/api/v1/communities/#{community.id}/tunes/#{community.playlist_tunes[0].id}" \
             "/users/#{community.members[1].id}/comments",
             params: { comment: { body: 'test' } }
        get "/api/v1/communities/#{community.id}/tunes/#{community.playlist_tunes[0].id}/comments"
      end

      # userのコメントが作成された場合、同じcommunity, tuneの別のuserが作成したコメントも含めてコメントを返すこと
      it 'returns comments including comments created by other users' do
        json = response.parsed_body
        comments = json['comments']
        expect(comments.length).to eq(2)
      end

      # community.members[0]が作成したコメントが最初に表示されること
      it 'displays comments created by community.members[0] first' do
        json = response.parsed_body
        comments = json['comments']
        expect(comments[0]['user']['name']).to eq(community.members[0].name)
      end

      # community.members[1]が作成したコメントが次に表示されること
      it 'displays comments created by community.members[1] next' do
        json = response.parsed_body
        comments = json['comments']
        expect(comments[1]['user']['name']).to eq(community.members[1].name)
      end
    end
  end

  # destroyアクションのテスト
  describe 'DELETE /api/v1/communities/community_id/tunes/:tune_id/users/:user_id/comments/:id' do
    let!(:community) { create(:community, :with_comments, :with_playlist_tunes, :with_members) }

    # コメントが存在する場合、200ステータスコードを返すこと
    it 'returns 200 status code if comment exists' do
      delete "/api/v1/communities/#{community.id}/tunes/#{community.comments[0].tune.id}" \
             "/users/#{community.comments[0].user.id}/comments/#{community.comments[0].id}"
      expect(response).to have_http_status(:ok)
    end

    # コメントが存在しない場合、404ステータスコードを返すこと
    it 'returns 404 status code if comment does not exist' do
      delete "/api/v1/communities/#{community.id}/tunes/#{community.comments[0].tune.id}" \
             "/users/#{community.comments[0].user.id}/comments/0"
      expect(response).to have_http_status(:not_found)
    end

    # コメントが削除されること
    it 'deletes comment' do
      delete "/api/v1/communities/#{community.id}/tunes/#{community.comments[0].tune.id}" \
             "/users/#{community.comments[0].user.id}/comments/#{community.comments[0].id}"
      expect(Comment.find_by(id: community.comments[0].id)).to be_nil
    end

    # コメントが削除された場合、削除されたコメントを含まないコメントを返すこと
    it 'returns comments excluding deleted comment' do
      tune = community.playlist_tunes[0]
      user1 = community.members[0]
      user2 = community.members[1]

      post "/api/v1/communities/#{community.id}/tunes/#{tune.id}/users/#{user1.id}/comments",
           params: { comment: { body: 'test' } }
      json = response.parsed_body
      comments = json['comments']
      comment_id = comments[0]['id']

      post "/api/v1/communities/#{community.id}/tunes/#{tune.id}/users/#{user2.id}/comments",
           params: { comment: { body: 'test' } }

      delete "/api/v1/communities/#{community.id}/tunes/#{tune.id}/users/#{user1.id}/comments/#{comment_id}"

      # get "/api/v1/communities/#{community.id}/tunes/#{tune.id}/comments"
      json = response.parsed_body
      # delete_comments = json['comments']
      expect(json.length).to eq(1)
    end
  end
end
