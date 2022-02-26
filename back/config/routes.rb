require 'sidekiq/web'

Rails.application.routes.draw do

  root 'home#index'

  namespace :api do
    namespace :v1 do
      resources :suggestions
      resources :vocabularies, only: :show
    end
  end

  mount Sidekiq::Web => '/sidekiq', constraints: lambda { |request| request.remote_ip === '127.0.0.1' }

  get '*path' => 'home#index'

end
