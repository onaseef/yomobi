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
    docs.push self.meta_doc(docs,wtabs)
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
  
  def self.meta_doc(widget_docs,wtabs)
    worder = {}
    widget_docs.each_index {|i| worder[ widget_docs[i][:name] ] = i}

    {
      "_id" => "worder",
      "worderInit" => worder,
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
        :wtype => 'link_fb',
        :wsubtype => 'flickr',
        :host => 'http://m.flickr.com/photos/',
        :basename => 'flickr',
        :singleton => true
      },
      
      {
        :wtype => 'link_fb',
        :wsubtype => "picasa",
        :host => 'http://picasaweb.google.com/',
        :basename => 'picasa',
        :singleton => true
      },

      {
        :wtype => 'link',
        :wsubtype => "blog",
        :singleton => true
      },

      {
        :wtype => 'link',
        :wsubtype => "donate",
        :singleton => true
      },

      {
        :wtype => 'link',
        :wsubtype => "news",
        :singleton => true
      },

      {
        :wtype => 'link',
        :wsubtype => "reviews",
        :singleton => true
      },
      
      {
        :wtype => 'call_back',
        :wsubtype => "call-me-back",
        :singleton => true,
        :email => nil
      },

      {
        :wtype => 'category',
        :wsubtype => "property-listings",
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
        :wtype => 'link_fb',
        :wsubtype => "twitter",
        :host => 'http://twitter.com/',
        :basename => 'twitter',
        :singleton => true
      },

      {
        :wtype => 'link_fb',
        :wsubtype => "facebook",
        :host => 'http://facebook.com/',
        :basename => 'facebook',
        :singleton => true
      },

      {
        :wtype => 'page_tree',
        :wsubtype => "category",
        :catTypeName => "Subcategory",
        :itemTypeName => "Page",
        "struct" => {
          "_items" => []
        }
      },

      {
        :wtype => 'booking',
        :wsubtype => "booking-request",
        :singleton => true,
        :email => nil
      },

      {
        :wtype => 'tell_friend',
        :wsubtype => "tell-a-friend",
        :singleton => true
      },

      {
        :wtype => 'leave_msg',
        :wsubtype => "leave-a-message",
        :singleton => true,
        :email => nil
      },

      {
        :wtype => 'link',
        :wsubtype => "event-calendar",
        :singleton => true
      },

      {
        :wtype => 'custom_page',
        :wsubtype => "custom-page",
      },

      {
        :wtype => 'link',
        :wsubtype => "photo-bucket",
        :singleton => true
      },

      {
        :wtype => 'informed',
        :wsubtype => "keep-me-informed",
        :singleton => true,
        :email => nil,
        'optForEmails' => true,
        'optForTexts' => true
      },

      {
        :wtype => 'coupon',
        :wsubtype => "coupon",
      },

      {
        :wtype => 'link',
        :wsubtype => "full-website",
        :singleton => true
      },

      {
        :wtype => 'category',
        :wsubtype => "locations",
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
        :wtype => 'hours',
        :wsubtype => "business-hours",
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
        :wtype => 'category',
        :wsubtype => "services",
        :catTypeName => "Category",
        :itemTypeName => "Service",
        :singleton => true,
        "struct" => {
          "_items" => []
        }
      },

      {
        :wtype => 'category',
        :wsubtype => "products",
        :catTypeName => "Category",
        :itemTypeName => "Product",
        :singleton => true,
        "struct" => {
          "_items" => []
        }
      },

      {
        :wtype => 'category',
        :wsubtype => "menu",
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
        :wtype => 'phone',
        :wsubtype => "call-us",
      },

      {
        :wtype => 'gmap',
        :wsubtype => "find-us",
      },

      {
        :wtype => 'custom_page',
        :wsubtype => 'about-us'
      },

      {
        :wtype => 'link',
        :wsubtype => "link",
      },

      {
        :wtype => 'link',
        :wsubtype => "video"
      },
    ].sort! {|a,b| b[:wsubtype] <=> a[:wsubtype]}
  end
end
