Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      root 'communities#index'

      resources :communities, only: [:index, :show, :create, :edit, :update, :destroy] do
        resources :memberships, only: [:create, :destroy]
        resources :playlists, only: [:index, :create, :destroy]
      end

      resources :users, only: [:show, :create, :edit, :update, :destroy] do
        resources :likes, only: [:index, :create, :destroy]
        resources :checks, only: [:index, :create, :destroy]
      end

      # resources :tunes, only: [:show, :create]

      get 'comments/community_id/:user_id/:tune_id', to: 'comments#index'
      post 'comments/community_id/:user_id/:tune_id', to: 'comments#create'
      delete 'comments/community_id/:user_id/:tune_id/:id', to: 'comments#destroy'
    end
  end
end
