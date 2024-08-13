require 'rails_helper'

RSpec.describe Playlist, type: :request do
  # indexアクションのテスト
  describe 'GET /api/v1/communities/:community_id/playlists' do
    # playlistオブジェクトが存在する場合、200ステータスコードを返すこと
    it 'returns 200 status code if playlist object exists' do
      community = create(:community, :with_playlist_tunes)
      get "/api/v1/communities/#{community.id}/playlists"
      expect(response).to have_http_status(:ok)
    end

    # playlistオブジェクトがadded_atの降順で返されること
    it 'returns playlist object in descending order of added_at' do
      community = create(:community, :with_playlist_tunes)
      get "/api/v1/communities/#{community.id}/playlists"
      # レスポンスボディ（JSON形式の文字列）をRubyのハッシュに変換
      playlist = response.parsed_body
      expect(playlist[0]['added_at']).to be > playlist[1]['added_at']
    end
  end

  # create_recommendアクションのテスト
  describe 'POST /api/v1/communities/:community_id/playlists/:tune_id' do
    let(:tune) { create(:tune) }
    let(:community) { create(:community) }
    let!(:playlist_tune) { create(:playlist, tune: tune, community: community) }

    context "when the recommendation is successful" do
      it "updates the recommendation and returns the playlists" do
        post "/api/v1/communities/#{community.id}/playlists/#{tune.id}"
        expect(response).to have_http_status(:ok)
      end

      it "returns the correct number of playlists" do
        post "/api/v1/communities/#{community.id}/playlists/#{tune.id}"
        expect(response.parsed_body.size).to eq(community.playlist_tunes.count)
      end

      it "updates the recommendation to be truthy" do
        post "/api/v1/communities/#{community.id}/playlists/#{tune.id}"
        expect(playlist_tune.reload.recommend).to be_truthy
      end
    end

    context "when the recommendation fails" do
      it "returns an error message" do
        post "/api/v1/communities/#{community.id}/playlists/9999999"
        expect(response).to have_http_status(:unprocessable_entity)
      end

      it "returns the correct error message" do
        post "/api/v1/communities/#{community.id}/playlists/9999999"
        expect(response.parsed_body).to eq("error" => "Tune or Community not found")
      end
    end
  end

  # destroy_recommendアクションのテスト
  describe 'DELETE /api/v1/communities/:community_id/playlists/:tune_id' do
    let(:tune) { create(:tune) }
    let(:community) { create(:community) }
    let!(:playlist_tune) { create(:playlist, tune: tune, community: community, recommend: true) }

    context "when the unrecommendation is successful" do
      it "updates the recommendation and returns the playlists" do
        delete "/api/v1/communities/#{community.id}/playlists/#{tune.id}"
        expect(response).to have_http_status(:ok)
      end

      it "returns the correct number of playlists" do
        delete "/api/v1/communities/#{community.id}/playlists/#{tune.id}"
        expect(response.parsed_body.size).to eq(community.playlist_tunes.count)
      end

      it "updates the recommendation to be falsy" do
        delete "/api/v1/communities/#{community.id}/playlists/#{tune.id}"
        expect(playlist_tune.reload.recommend).to be_falsy
      end
    end

    context "when the unrecommendation fails" do
      it "returns an error message" do
        delete "/api/v1/communities/#{community.id}/playlists/9999999"
        expect(response).to have_http_status(:unprocessable_entity)
      end

      it "returns the correct error message" do
        delete "/api/v1/communities/#{community.id}/playlists/9999999"
        expect(response.parsed_body).to eq("error" => "Tune or Community not found")
      end
    end
  end
end
