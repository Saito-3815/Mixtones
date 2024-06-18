require 'rails_helper'

RSpec.describe "Sessions", type: :request do
  # テスト用のパラメータとモックをセットアップ
  include_context 'when session is setup'

  # createアクションのテスト
  describe 'POST /api/v1/sessions' do
    # ユーザーオブジェクトが存在する場合、200ステータスコードを返すこと
    it 'returns 200 status code if user object exists' do
      post '/api/v1/sessions', params: { user: { code: spotify_code, code_verifier: code_verifier } }
      expect(response).to have_http_status(:ok)
    end

    # ユーザーがログインしていること
    it 'logs in the user' do
      post '/api/v1/sessions', params: { user: { code: spotify_code, code_verifier: code_verifier } }
      expect(session[:user_id]).to eq(1)
    end

    # user.like_tunesにログイン前に存在していなかったレコードのみが追加されていること
    it 'adds only records that did not exist in user.like_tunes before login' do
      post '/api/v1/sessions', params: { user: { code: spotify_code, code_verifier: code_verifier } }
      user = User.find(1)
      expect(user.like_tunes.count).to eq(3)
    end

    # データベースにユーザーデータが存在しない場合、サインアップURLを返すこと
    it 'returns a signup URL if user data does not exist in the database' do
      User.destroy_all
      post '/api/v1/sessions', params: { user: { code: spotify_code, code_verifier: code_verifier } }
      expect(response.parsed_body['redirect_url']).to eq("#{ENV.fetch('SPOTIFY_REDIRECT_URI')}signup")
    end
  end

  # destroyアクションのテスト
  describe 'DELETE /api/v1/sessions' do
    before do
      post '/api/v1/sessions', params: { user: { code: spotify_code, code_verifier: code_verifier } }
    end

    # ログアウト時に200ステータスコードを返すこと
    it 'returns 200 status code when logging out' do
      delete '/api/v1/sessions'
      expect(response).to have_http_status(:ok)
    end

    # ログアウト時にセッションがリセットされていること
    it 'resets the session when logging out' do
      delete '/api/v1/sessions'
      expect(session[:user_id]).to be_nil
    end
  end
end
