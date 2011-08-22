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
        :host => 'http://m.flickr.com/photos/',
        :basename => 'flickr',
        :singleton => true
      },
      
      {
        :name => "picasa",
        :wtype => 'link_fb',
        :host => 'http://picasaweb.google.com/',
        :basename => 'picasa',
        :singleton => true
      },

      {
        :name => "blog",
        :wtype => 'link',
        :singleton => true
      },

      {
        :name => "donate",
        :wtype => 'link',
        :singleton => true
      },

      {
        :name => "news",
        :wtype => 'link',
        :singleton => true
      },

      {
        :name => "reviews",
        :wtype => 'link',
        :singleton => true
      },
      
      {
        :name => "call-me-back",
        :wtype => 'call_back',
        :singleton => true,
        :email => nil
      },

      {
        :name => "property-listings",
        :wtype => 'category',
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
        :host => 'http://twitter.com/',
        :basename => 'twitter',
        :singleton => true
      },

      {
        :name => "facebook",
        :wtype => 'link_fb',
        :host => 'http://facebook.com/',
        :basename => 'facebook',
        :singleton => true
      },

      {
        :name => "category",
        :wtype => 'page_tree',
        :catTypeName => "Subcategory",
        :itemTypeName => "Page",
        "struct" => {
          "_items" => []
        }
      },

      {
        :name => "booking-request",
        :wtype => 'booking',
        :singleton => true,
        :email => nil
      },

      {
        :name => "tell-a-friend",
        :wtype => 'tell_friend',
        :singleton => true
      },

      {
        :name => "leave-a-message",
        :wtype => 'leave_msg',
        :singleton => true,
        :email => nil
      },

      {
        :name => "event-calendar",
        :wtype => 'link',
        :singleton => true
      },

      {
        :name => "custom-page",
        :wtype => 'custom_page',
      },

      {
        :name => "photo-bucket",
        :wtype => 'link',
        :singleton => true
      },

      {
        :name => "keep-me-informed",
        :wtype => 'informed',
        :singleton => true,
        :email => nil,
        'optForEmails' => true,
        'optForTexts' => true
      },

      {
        :name => "coupon",
        :wtype => 'coupon',
      },

      {
        :name => "full-website",
        :wtype => 'link',
        :singleton => true
      },

      {
        :name => "locations",
        :wtype => 'category',
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
      },

      {
        :name => "find-us",
        :wtype => 'gmap',
      },

      {
        :name => "about-us",
        :wtype => 'custom_page',
        :wsubtype => 'about-us'
      },

      {
        :name => "link",
        :wtype => 'link',
      },

      {
        :name => "video",
        :wtype => 'link',
        :wsubtype => 'video'
      },
    ].sort! {|a,b| b[:name] <=> a[:name]}
  end
end
