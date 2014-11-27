Bairdconklinmusic::Application.routes.draw do
  
  # Baird-Conklin Math
  match '/bairdconklinmath' => 'static_pages#math'
  match '/bairdconklinmath/mathtools/primes' => 'mathtools#primes'
  match '/bairdconklinmath/mathtools/factor' => 'mathtools#factor'
  match '/bairdconklinmath/games/reversi' => 'games#reversi'
  match '/bairdconklinmath/games/test_reversi' => 'games#test_reversi'
  
  # Baird-Conklin Music
  match '/' => 'static_pages#home'
  match '/contact_us' => 'static_pages#contact_us'
  match '/files' => 'files#index'
  match '/files/upload' => 'files#upload'
  match '/files/delete' => 'files#delete'
  match '/search' => 'search#index'
  
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
  
  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  # root :to => 'welcome#index'

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id))(.:format)'
end
