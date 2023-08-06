require 'sidekiq/web'

Rails.application.routes.draw do
  devise_for :users, path: 'api/v1', path_names: { sign_in: 'login', sign_out: 'logout' }, controllers: { sessions: 'api/v1/sessions' }

  root 'home#index'

  namespace :api do
    namespace :v1 do
      resources :suggestions
      resources :notice, only: :create
      resources :concepts, only: :create
      resources :image, only: :create
      resources :contributors, only: :create
      resources :vocabularies, only: :show
    end
  end

  mount Sidekiq::Web => '/sidekiq', constraints: lambda { |request| request.remote_ip === '127.0.0.1' }

  get '*path' => 'home#index'

end
