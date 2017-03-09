Bairdconklinmusic::Application.routes.draw do
  
  match '/' => 'static_pages#home'
  match '/contact_us' => 'static_pages#contact_us'
  match '/files' => 'files#index'
  match '/files/upload' => 'files#upload'
  match '/files/delete' => 'files#delete'
  match '/uploads/:filename' => 'files#uploads'
  match '/search' => 'search#index'
  match '/search/browse' => 'search#browse'
  match '/search/by_category' => 'search#by_category'
  match '/search/by_voicing' => 'search#by_voicing'
  
  resources :users do
    collection do
      get :login
      post :login
      get :logout
    end
    member do
      delete :delete
    end
  end
  
  resources :compositions do
    member do
      delete :delete
    end
  end
  
  resources :categories do
    member do
      delete :delete
    end
  end

  resources :voicings do
    member do
      delete :delete
    end
  end
  
end
