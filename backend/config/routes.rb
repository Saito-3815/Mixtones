Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      root 'communities#index'

      resources :communities, only: [:index, :show, :create, :edit, :update, :destroy] do
        resources :memberships, only: [:create]
        delete :'memberships/:user_id', to: 'memberships#destroy'
        resources :playlists, only: [:index]
        get 'tunes/:tune_id/comments', to: 'comments#index'
        post 'tunes/:tune_id/users/:user_id/comments', to: 'comments#create'
        delete 'tunes/:tune_id/users/:user_id/comments/:id', to: 'comments#destroy'
      end

      resources :users, only: [:show, :create, :edit, :update, :destroy] do
        resources :likes, only: [:create] # お気に入りを追加登録
        get 'likes/latest', to: 'likes#latest' # 最新のlike_tunesを取得
        resources :checks, only: [:index, :create, :destroy]
      end
      resources :sessions, only: [:create, :destroy]
    end
  end
end
