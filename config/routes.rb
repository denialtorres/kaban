Rails.application.routes.draw do
  resources :boards do
    resources :columns do
      resources :cards do
        resource :move, only: :update, module: :cards
      end
    end
  end

  devise_for :users
  root 'boards#index'
  get "up" => "rails/health#show", as: :rails_health_check
end
