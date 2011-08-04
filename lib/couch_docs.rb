class CouchDocs
  require 'digest/sha1'

  def self.default_docs(company_type_name,default_email)
    docs = []
    wtabs = nil
    WMAPS['docs'].each do |spec|
      if spec['types'].include?(company_type_name)
        docs.concat spec['widgets'].map {|name| self.by_name(name)}
        wtabs = spec['tabs']
        break
      end
    end
    docs.each {|doc| doc[:email] = default_email if doc.has_key? :email }
    docs.push self.worder_doc(docs,wtabs)
    docs.push self.view_doc
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
  
  def self.worder_doc(widget_docs,wtabs)
    worder = {}
    widget_docs.each_index {|i| worder[ widget_docs[i][:name] ] = i}

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
    self.by_name('find-us').merge!(address)
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

  def self.all
    @all_docs ||= [
      {
        :name => "flickr",
        :wtype => 'link_fb',
        :helpText => "Add a link to your Flickr album on your mobile site.",
        :subHelpText => "Flickr alias or custom URL",
        :host => 'http://m.flickr.com/photos/',
        :basename => 'flickr',
        :singleton => true
      },
      
      {
        :name => "picasa",
        :wtype => 'link_fb',
        :helpText => "Add a link to your Picasa album on your mobile site.",
        :subHelpText => "Picasa album URL",
        :host => 'http://picasaweb.google.com/',
        :basename => 'picasa',
        :singleton => true
      },

      {
        :name => "blog",
        :wtype => 'link',
        :helpText => "Add a link to your blog on your mobile site.",
        :subHelpText => "Blog",
        :singleton => true
      },

      {
        :name => "news",
        :wtype => 'link',
        :helpText => "Add a link to your online news site on your mobile site.",
        :subHelpText => "online news site",
        :singleton => true
      },

      {
        :name => "reviews",
        :wtype => 'link',
        :helpText => "Show visitors how great you are by adding a link to your online reviews page on your mobile site.",
        :subHelpText => "reviews page",
        :singleton => true
      },
      
      {
        :name => "call-me-back",
        :wtype => 'call_back',
        :helpText => "Allow your mobile site visitors to request a call back from you.",
        :singleton => true,
        :email => nil
      },

      {
        :name => "property-listings",
        :wtype => 'category',
        :helpText => "Give your mobile site visitors easy access to your property listings.",
        :subHelpText => "create a mobile optimized list of properties for lease or sale.",
        :catTypeName => "Area",
        :itemTypeName => "Listing",
        :singleton => true,
        # default categories
        "struct" => {
          "_items" => [],
          "North|0"    => { "_items" => [] },
          "South|1"    => { "_items" => [] },
          "East|2"     => { "_items" => [] },
          "West|3"     => { "_items" => [] },
          "Central|4"  => { "_items" => [] },
          "Downtown|5" => { "_items" => [] }
        }
      },
      
      {
        :name => "twitter",
        :wtype => 'link_fb',
        :helpText => "Add a link to your twitter account on your mobile site to make it easy for visitors to follow you.",
        :subHelpText => "Twitter ID",
        :host => 'http://twitter.com/',
        :basename => 'twitter',
        :singleton => true
      },

      {
        :name => "facebook",
        :wtype => 'link_fb',
        :helpText => "Add a link to your Facebook page on your mobile site to make it easy for visitors to friend you.",
        :subHelpText => "Facebook username",
        :host => 'http://facebook.com/',
        :basename => 'facebook',
        :singleton => true
      },

      {
        :name => "category",
        :wtype => 'page_tree',
        :helpText => "Create and organize custom web pages for your mobile site.",
        :subHelpText => "create and organize custom web pages for your mobile site.",
        :catTypeName => "Subcategory",
        :itemTypeName => "Page",
        "struct" => {
          "_items" => []
        }
      },

      {
        :name => "booking-request",
        :wtype => 'booking',
        :helpText => "Allow your mobile site visitors to email you a booking request.",
        :singleton => true,
        :email => nil
      },

      {
        :name => "tell-a-friend",
        :wtype => 'tell_friend',
        :helpText => "Let your mobile site visitors tell their friends about you.",
        :singleton => true
      },

      {
        :name => "leave-a-message",
        :wtype => 'leave_msg',
        :helpText => "Allow your mobile website visitors to easily leave you an email message.",
        :singleton => true,
        :email => nil
      },

      {
        :name => "event-calendar",
        :wtype => 'link',
        :helpText => "Add a link to your online calendar on your mobile site.",
        :subHelpText => "online calendar",
        :singleton => true
      },

      {
        :name => "custom-page",
        :wtype => 'custom_page',
        :helpText => "Add a custom web page for your mobile site."
      },

      {
        :name => "photo-bucket",
        :wtype => 'link',
        :helpText => "Add a link to your PhotoBucket album on your mobile site.",
        :subHelpText => "Photobucket album custom",
        :singleton => true
      },

      {
        :name => "keep-me-informed",
        :wtype => 'informed',
        :helpText => "Allow your mobile site visitors to follow you via email and text notifications.",
        :singleton => true,
        :email => nil,
        'optForEmails' => true,
        'optForTexts' => true
      },

      {
        :name => "coupon",
        :wtype => 'coupon',
        :helpText => "Add a coupon to your mobile site."
      },

      {
        :name => "full-website",
        :wtype => 'link',
        :helpText => "Add a link to your full website on your mobile site.",
        :subHelpText => "full website",
        :singleton => true
      },

      {
        :name => "locations",
        :wtype => 'category',
        :helpText => "Give your mobile site visitors easy access to a directory of your business locations.",
        :subHelpText => "create a directory of your business locations.",
        :catTypeName => "Region",
        :itemTypeName => "Location",
        :singleton => true,
        "struct" => {
          "_items" => [],
          "North|0"    => { "_items" => [] },
          "South|1"    => { "_items" => [] },
          "East|2"     => { "_items" => [] },
          "West|3"     => { "_items" => [] },
          "Central|4"  => { "_items" => [] },
          "Downtown|5" => { "_items" => [] }
        }
      },

      {
        :name => "business-hours",
        :wtype => 'hours',
        :helpText => "Let your mobile site visitors know when you are open for business.",
        "doubleTime" => false,
        "hours" => {
          "mon" => ["8:00 am|5:00 pm","",false,true],
          "tue" => ["8:00 am|5:00 pm","",false,true],
          "wed" => ["8:00 am|5:00 pm","",false,true],
          "thu" => ["8:00 am|5:00 pm","",false,true],
          "fri" => ["8:00 am|5:00 pm","",false,true],
          "sat" => ["8:00 am|5:00 pm","",false,true],
          "sun" => ["8:00 am|5:00 pm","",false,true]
        }
      },

      {
        :name => "services",
        :wtype => 'category',
        :helpText => "Give your mobile site visitors easy access to your catalog of services.",
        :subHelpText => "create a mobile optimized catalog of your services.",
        :catTypeName => "Category",
        :itemTypeName => "Service",
        :singleton => true,
        "struct" => {
          "_items" => []
        }
      },

      {
        :name => "products",
        :wtype => 'category',
        :helpText => "Give your mobile site visitors easy access to your catalog of products",
        :subHelpText => "create a mobile optimized catalog of your products.",
        :catTypeName => "Category",
        :itemTypeName => "Product",
        :singleton => true,
        "struct" => {
          "_items" => []
        }
      },

      {
        :name => "menu",
        :wtype => 'category',
        :helpText => "Give your mobile site visitors easy access to your menu.",
        :subHelpText => "create a mobile optimized version of your menu.",
        :catTypeName => "Category",
        :itemTypeName => "Item",
        :singleton => true,
        "struct" => {
          "_items" => [],
          "Appetizers|0" => { "_items" => [] },
          "Breakfast|1"  => { "_items" => [] },
          "Lunch|2"      => { "_items" => [] },
          "Dinner|3"     => { "_items" => [] },
          "Drinks|4"      => { "_items" => [] }
        }
      },

      {
        :name => "call-us",
        :wtype => 'phone',
        :helpText => "Allow your mobile site visitors to call you with a single click."
      },

      {
        :name => "find-us",
        :wtype => 'gmap',
        :helpText => "Allow your mobile site visitors to easily find you."
      },

      {
        :name => "about-us",
        :wtype => 'custom_page',
        :helpText => "Tell your mobile site visitors about you.",
        :iconName => 'about-us'
      },

      {
        :name => "link",
        :wtype => 'link',
        :helpText => "Add a link to another website on your mobile site."
      }
    ].sort! {|a,b| b[:name] <=> a[:name]}
  end
end
