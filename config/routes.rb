Yomobi::Application.routes.draw do

  get 'home/index'
  
  match 'account-setup/:step_num' => 'signup#account_setup', :as => :account_setup

  devise_for :users, :controllers => {
    :registrations => 'registrations',
    :sessions => 'sessions'
  }

  get 'builder/main'      => 'builder#index', :as => :builder_main
  post 'builder/settings' => 'builder#change_settings'

  get 'builder/text'      => 'widgets/informed#text_panel', :as => :builder_text
  post 'builder/text'     => 'widgets/informed#send_text'
  get 'builder/email'     => 'widgets/informed#email_panel', :as => :builder_email
  post 'builder/email'    => 'widgets/informed#send_email'

  match 'builder/booster'   => 'builder#traffic_booster', :as => :builder_booster

  put    'widgets/:id' => 'builder#update_widget'
  post   'widgets'     => 'builder#new_widget'
  delete 'widgets/:_id/:_rev' => 'builder#delete_widget'
  
  post 'order' => 'builder#update_order'

  get 'opt-out/:key' => 'widgets/informed#opt_out'

  root :to => 'home#index'
  
  ##########################
  # Widget-specific routes #
  ##########################
  exceptions = ['/admin']
  constraints lambda {|req| exceptions.map{|route| !req.path.starts_with? route}.any?} do
    get ':company' => 'mobile#index', :as => :mobile
    post ':company/leave_msg/submit' => 'widgets/leave_msg#submit'
    post ':company/call_back/submit' => 'widgets/call_back#mobile_submit'
    post ':company/tell_friend/submit' => 'widgets/tell_friend#mobile_submit'
    post ':company/informed/submit' => 'widgets/informed#mobile_submit'
    post ':company/booking/submit' => 'widgets/booking#mobile_submit'
  end

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
  # root :to => "welcome#index"

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id(.:format)))'
end
