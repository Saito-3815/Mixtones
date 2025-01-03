require 'sidekiq/web'
require 'sidekiq/cron/web'

Rails.application.routes.draw do
  mount Sidekiq::Web => '/sidekiq' # sidekiqの管理画面

  get '/health_check', to: 'health_checks#index'

  namespace :api do
    namespace :v1 do
      root 'communities#index'

      resources :communities, only: [:index, :show, :create, :edit, :update, :destroy] do
        put :update_avatar, to: 'communities#update_avatar'
        resources :memberships, only: [:create]
        delete :memberships, to: 'memberships#destroy'
        resources :playlists, only: [:index]
        post 'playlists/:tune_id', to: 'playlists#create_recommend'
        delete 'playlists/:tune_id', to: 'playlists#destroy_recommend'
        get 'tunes/:tune_id/comments', to: 'comments#index'
        post 'tunes/:tune_id/users/:user_id/comments', to: 'comments#create'
        delete 'tunes/:tune_id/users/:user_id/comments/:id', to: 'comments#destroy'
      end

      resources :users, only: [:show, :create, :edit, :update, :destroy] do
        put :update_avatar, to: 'users#update_avatar'
        resources :likes, only: [:create] # お気に入りを追加登録
        get 'likes/latest', to: 'likes#latest' # 最新のlike_tunesを取得
        resources :checks, only: [:index, :create, :destroy]
        delete :checks, to: 'checks#destroy'
      end
      post 'users/password', to: 'users#create_password_user'

      resources :sessions, only: [:create]
      delete 'sessions', to: 'sessions#destroy'
      get 'sessions', to: 'sessions#current_user_show'
      post 'sessions/guest', to: 'sessions#guest_login'
      post 'sessions/password', to: 'sessions#password_login'

      post 'images', to: 'images#create'

      # テストエンドポイント
      post 'test_job', to: 'jobs#create'
    end
  end
end
