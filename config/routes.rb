Yomobi::Application.routes.draw do

  get "payments/index"

  constraints(MobileDomain) do
    match '/' => 'mobile#index'
    post ':company/leave_msg/submit' => 'widgets/leave_msg#submit'
    post ':company/call_back/submit' => 'widgets/call_back#mobile_submit'
    post ':company/tell_friend/submit' => 'widgets/tell_friend#mobile_submit'
    post ':company/informed/submit' => 'widgets/informed#mobile_submit'
    post ':company/booking/submit' => 'widgets/booking#mobile_submit'
    get 'mobile/aritcaptcha' => 'mobile#aritcaptcha'
    match '*else' => redirect('/')
  end

  get 'about' => 'home#about', :as => :about
  get 'biz' => 'home#opportunity', :as => :opportunity
  get 'business-opportunities' => 'home#opportunity', :as => :opportunity
  get 'help' => redirect('http://help.yomobi.com'), :as => :help
  get 'how-to-make-a-mobile-website' => 'home#easy', :as => :easy
  get 'privacy' => 'home#privacy', :as => :privacy
  get 'terms' => 'home#terms', :as => :terms
  get 'vote' => redirect('http://www.facebook.com/yomobi?sk=app_208195102528120'), :as => :vote
  get 'webesity' => 'home#webesity', :as => :webesity
  get 'why-mobile' => 'home#why_mobile', :as => :why_mobile



  get 'confirm' => 'home#confirm_account', :as => :confirm_account
  post 'confirm' => 'home#resend_confirmation', :as => :resend_confirmation

  get "account/edit", :as => :account
  put "account/update", :as => :update_account

  namespace :account do
    resources :payments, :only => [:index, :show]
  end

  match 'account-setup/:step_num' => 'signup#account_setup', :as => :account_setup

  devise_for :users, :controllers => {
    :registrations => 'registrations',
    :sessions => 'sessions'
  }
  devise_scope :user do
    get 'confirmation/new' => 'confirmations#show'
  end


  get "site-manager" => 'site_manager#index', :as => :site_manager
  get "sites/:id/activate" => 'site_manager#make_active', :as => :activate_site

  post    "sites"     => 'site_manager#create', :as => :create_site
  delete  "sites/:id" => 'site_manager#delete'
  post    "sites/:id/make-default" => 'site_manager#make_default', :as => :make_default_site
  post    "sites/:id/concede"      => 'site_manager#concede', :as => :concede_site
  post    "sites/:id/upgrade"      => 'site_manager#upgrade', :as => :upgrade
  post    "sites/:id/cancel_sub"   => 'site_manager#cancel_subscription', :as => :cancel_sub

  post "sites/:id/admins"           => 'site_manager#add_admin', :as => :add_admin
  post "sites/:id/admins/:admin_id/delete" => 'site_manager#remove_admin', :as => :remove_admin
  post "sites/:id/signup-key" => 'site_manager#gen_signup_key', :as => :gen_signup_key

  post "sites/:id/domains"          => 'site_manager#add_domain', :as => :add_domain
  post "sites/:id/domains/:domain_id/delete" => 'site_manager#remove_domain', :as => :remove_domain


  get 'builder/main'      => 'builder#index', :as => :builder_main

  post 'builder/wphoto/upload' => 'builder#upload_wphoto', :as => :wphoto_upload
  post 'builder/gen-id'   => 'builder#inc_id_counter'
  post 'builder/settings' => 'builder#change_settings'

  get 'builder/text'      => 'widgets/informed#text_panel', :as => :builder_text
  post 'builder/text'     => 'widgets/informed#send_text'
  get 'builder/email'     => 'widgets/informed#email_panel', :as => :builder_email
  post 'builder/email'    => 'widgets/informed#send_email'

  post 'builder/adv-settings'     => 'builder#change_advanced_settings'
  post 'builder/customize'        => 'builder#customize'
  post 'builder/customize/upload' => 'builder#upload_customize', :as => :customize_upload

  put    'widgets/:id' => 'builder#update_widget'
  post   'widgets'     => 'builder#new_widget'
  delete 'widgets/:_id/:_rev' => 'builder#delete_widget'

  post 'order' => 'builder#update_order'

  get 'opt-out/:key' => 'widgets/informed#opt_out'

  root :to => 'home#index'

  get '/javascripts/mobile-redirect.js' => 'mobile#mobile_redirect'
  get 'preview/:company' => 'mobile#index', :as => :mobile_preview, :defaults => { :preview => true }


  ######################
  # Mobile-side routes #
  ######################
  get 'mobile/aritcaptcha' => 'mobile#aritcaptcha'

  ##########################
  # Widget-specific routes #
  ##########################
  exceptions = ['/admin','/ad-test']
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
