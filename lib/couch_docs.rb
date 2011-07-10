class CouchDocs
  require 'digest/sha1'

  def self.default_docs(company_type_id)
    docs = []
    self.default_doc_map.each do |ids,doc_names|
      if ids.include?(company_type_id)
        docs.concat doc_names.map {|name| self.by_name(name)}
      end
    end
    docs
  end

  def self.security_doc(db_name)
    {
      "_id" => "_security",
      "admins" => {"names" => [db_name], "roles" => []},
      "readers" => {"names" => [], "roles" => []}
    }
  end
  
  def self.admin_user_doc(name,pass)
    salt = self.gen_salt
    {
      "_id" => "org.couchdb.user:admin_#{name}",
      "name" => "admin_#{name}",
      "type" => "user",
      "salt" => salt,
      "password_sha" => Digest::SHA1.hexdigest(pass + salt),
      "roles" => []
    }
  end
  
  def self.view_doc
    {
      "_id" => "_design/widgets",
      "language" => "javascript",
      "views" => {
        "by_name" => {
          "map" => "function(doc) {
            if(doc.wtype)
              emit([doc.disabled_,doc.name],null);
          }"
        },
        "in_use_by_name" => {
          "map" => "function(doc) {
            if(doc.wtype)
              emit(doc.name,null);
          }"
        }
      }
    }
  end
  
  def self.worder_doc(company_type_id)
    worder = {}
    self.default_doc_map.each do |ids,doc_names|
      if ids.include?(company_type_id)
        doc_names.each_index {|i| worder[doc_names[i]] = i}
      end
    end

    wtabs = []
    self.default_tab_map.each do |ids,tab_names|
      if ids.include?(company_type_id)
        wtabs = tab_names
      end
    end
    {
      "_id" => "worder",
      "worder" => worder,
      "wtabs" => wtabs
    }
  end
  
  def self.about_us_doc(desc)
    self.by_name('about-us').merge :content => desc
  end
  
  def self.phone_doc(phone)
    self.by_name('call-us').merge :phone => phone
  end
  
  def self.gmap_doc(address)
    self.by_name('gmap').merge!(address)
  end
  
  def self.gen_salt
    lengths = [[48,10],[97,26]]
    result = ""
    32.times { type = lengths[rand 2]; result += (type[0] + (rand type[1])).chr }
    result
  end

  def self.by_name(doc_name)
    self.all.select {|doc| doc[:name] == doc_name}.first
  end

  def self.default_tab_map
    {
      [1, 4, 6, 12, 12, 14, 20, 25, 26] => %w{
        services keep-me-informed photo-bucket
      },
      [2] => %w{
        facebook leave-a-message photo-bucket
      },
      [5, 15, 17, 21, 27] => %w{
        services keep-me-informed business-hours
      },
      [7, 8, 9, 24] => %w{
        menu keep-me-informed business-hours
      },
      [10, 13, 16, 18, 19, 23] => %w{
        business-hours keep-me-informed full-website
      },
      [22] => %w{
        listings leave-a-message keep-me-informed
      }
    }
  end

  def self.default_doc_map
    {
      [1, 4, 6, 12, 12, 14, 20, 25, 26] => %w{
        full-website business-hours services products
        photo-bucket keep-me-informed leave-a-message
        facebook coupon event-calendar news
      },
      [2] => %w{
        full-website facebook custom-page services photo-bucket
        leave-a-message blog twitter keep-me-informed
      },
      [5, 15, 17, 21, 27] => %w{
        full-website business-hours services photo-bucket
        keep-me-informed leave-a-message facebook coupon
        event-calendar news
      },
      [7, 8, 9, 24] => %w{
        full-website menu business-hours services coupon
        photo-bucket keep-me-informed leave-a-message
        facebook event-calendar news
      },
      [10, 13, 16, 18, 19, 23] => %w{
        full-website business-hours services
        photo-bucket keep-me-informed event-calendar
        leave-a-message facebook news
      },
      [22] => %w{
        full-website listings
        photo-bucket keep-me-informed leave-a-message
        facebook business-hours event-calendar news
      }
    }
  end

  def self.all
    @all_docs ||= [
      {
        :name => "flickr",
        :wtype => 'link_fb',
        :helpText => "Add a one-tap link to your mobile Flickr page.",
        :host => 'http://m.flickr.com/photos/',
        :basename => 'flickr',
        :singleton => true
      },
      
      {
        :name => "picasa",
        :wtype => 'link_fb',
        :helpText => "Add a one-tap link to your Picasa page.",
        :host => 'http://picasaweb.google.com/',
        :basename => 'picasa',
        :singleton => true
      },

      {
        :name => "blog",
        :wtype => 'link',
        :helpText => "Add a link from your YoMobi mobile website to your blog.",
        :singleton => true
      },

      {
        :name => "news",
        :wtype => 'link',
        :helpText => "Add a link from your YoMobi mobile website to your news webpage.",
        :singleton => true
      },

      {
        :name => "reviews",
        :wtype => 'link',
        :helpText => "Add a one-tap link to a website that has reviews of your business.",
        :singleton => true
      },
      
      {
        :name => "call-me-back",
        :wtype => 'call_back',
        :helpText => "This widget allows your customers to request you to call them back.",
        :singleton => true
      },

      {
        :name => "home-listings",
        :wtype => 'category',
        :helpText => "Give your customers instant access to your real estate listings.",
        :singleton => true
      },
      
      {
        :name => "twitter",
        :wtype => 'link_fb',
        :helpText => "Add a one-tap link to your businesses's Twitter page.",
        :host => 'http://twitter.com/',
        :basename => 'twitter',
        :singleton => true
      },

      {
        :name => "facebook",
        :wtype => 'link_fb',
        :helpText => "Add a one-tap link to your businesses's Facebook page.",
        :host => 'http://facebook.com/',
        :basename => 'facebook',
        :singleton => true
      },

      {
        :name => "category",
        :wtype => 'page_tree',
        :helpText => "Create your own mobile site map of custom pages."
      },

      {
        :name => "booking-request",
        :wtype => 'booking',
        :helpText => "Let your customers book a request through your Yomobi mobile website.",
        :singleton => true
      },

      {
        :name => "tell-a-friend",
        :wtype => 'tell_friend',
        :helpText => "This widget allows your customers to instantly email their friends about your mobile website.",
        :singleton => true
      },

      {
        :name => "leave-a-message",
        :wtype => 'leave_msg',
        :helpText => "Allow your customers to leave you an email message.",
        :singleton => true
      },

      {
        :name => "event-calendar",
        :wtype => 'link',
        :helpText => "Keep your customers up-to-date on your business's events.",
        :singleton => true
      },

      {
        :name => "custom-page",
        :wtype => 'custom_page',
        :helpText => "Write a page about whatever you like."
      },

      {
        :name => "photo-bucket",
        :wtype => 'link',
        :helpText => "Add a one-tap link to your PhotoBucket page.",
        :singleton => true
      },

      {
        :name => "keep-me-informed",
        :wtype => 'informed',
        :helpText => "This widget allows your customers to opt-in to receive email and sms notifications from you.",
        :singleton => true
      },

      {
        :name => "coupon",
        :wtype => 'coupon',
        :helpText => "Give your customers an incentive to choose your business."
      },

      {
        :name => "full-website",
        :wtype => 'link',
        :helpText => "Add a link from your YoMobi mobile website to your full website.",
        :singleton => true
      },

      {
        :name => "locations",
        :wtype => 'category',
        :helpText => "Give your customers instant access to your business's multiple locations.",
        :singleton => true
      },

      {
        :name => "business-hours",
        :wtype => 'hours',
        :helpText => "Let your customers know when you're open for business."
      },

      {
        :name => "services",
        :wtype => 'category',
        :helpText => "Give your customers instant access to your list of services.",
        :singleton => true
      },

      {
        :name => "products",
        :wtype => 'category',
        :helpText => "Give your customers instant access to your list of products.",
        :singleton => true
      },

      {
        :name => "menu",
        :wtype => 'category',
        :helpText => "Give your customers instant access to your restaurant's cuisine.",
        :singleton => true
      },

      {
        :name => "call-us",
        :wtype => 'phone',
        :helpText => "Add a number for one-click calling."
      },

      {
        :name => "find-us",
        :wtype => 'gmap',
        :helpText => "Show your customers a map of where your business is located."
      },

      {
        :name => "about-us",
        :wtype => 'custom_page',
        :helpText => "A page describing what your business is about.",
        :singleton => true
      }
    ]
  end
end
