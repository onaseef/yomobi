class CouchDocs
  require 'digest/sha1'

  def self.default_docs(company_type_name,default_email)
    docs = []
    wtabs = nil
    WMAPS['docs'].each do |spec|
      if spec['types'].include?(company_type_name)
        docs.concat spec['widgets'].map {|wsubtype| self.by_wsubtype(wsubtype)}
        wtabs = spec['tabs']
        break
      end
    end
    docs.each {|doc| doc[:email] = default_email if doc.has_key? :email }
    docs.push self.meta_doc(docs,wtabs)
    docs.push self.view_doc
    docs.push self.auth_doc, self.security_doc
  end

  def self.security_doc(db_name)
    {
      "_id" => "_security",
      "admins" => {"names" => ["yadmin"], "roles" => []},
      "readers" => {"names" => [], "roles" => []}
    }
  end

  def self.security_doc
    {
      "admins" => {
        "names" => ["yadmin"],
        "roles" => []
      },
      "readers" => {
        "names" => [],
        "roles" => []
      }
    }
  end

  def self.auth_doc
    {
      "_id" => "_design/_auth",
      "language" => "javascript",
      "validate_doc_update" => "function(newDoc, oldDoc, userCtx) {
        if (userCtx.roles.indexOf('_admin') !== -1) {
          return;
        } else {
          throw({forbidden: 'Only admins may edit and delete docs.'});
        }
      }"
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
              emit([doc.disabled_,doc.wsubtype],null);
          }"
        },
        "in_use_by_name" => {
          "map" => "function(doc) {
            if(doc.wtype)
              emit(doc.wsubtype,null);
          }"
        }
      }
    }
  end
  
  def self.meta_doc(widget_docs,wtabs)
    worder = {}
    widget_docs.each_index {|i| worder[ widget_docs[i][:wsubtype] ] = i}

    {
      "_id" => "meta",
      "worder" => {},
      "worderInit" => worder,
      "wtabs" => [],
      "wtabsInit" => wtabs
    }
  end
  
  def self.about_us_doc(desc)
    self.by_wsubtype('about-us').merge :content => desc
  end
  
  def self.phone_doc(phone)
    self.by_wsubtype('call-us').merge :phone => phone
  end
  
  def self.gmap_doc(address)
    self.by_wsubtype('find-us').merge!(address)
  end
  
  def self.gen_salt
    lengths = [[48,10],[97,26]]
    result = ""
    32.times { type = lengths[rand 2]; result += (type[0] + (rand type[1])).chr }
    result
  end

  def self.by_wsubtype(wsubtype)
    self.all.select {|doc| doc[:wsubtype] == wsubtype}.first
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
          "c0" => {
            :_data => { :type => "cat", :_id => "c0", :name => "North" }
          },
          "c1" => {
            :_data => { :type => "cat", :_id => "c1", :name => "South" }
          },
          "c2" => {
            :_data => { :type => "cat", :_id => "c2", :name => "East" }
          },
          "c3" => {
            :_data => { :type => "cat", :_id => "c3", :name => "West" }
          },
          "c4" => {
            :_data => { :type => "cat", :_id => "c4", :name => "Central" }
          },
          "c5" => {
            :_data => { :type => "cat", :_id => "c5", :name => "Downtown" }
          }
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
        "struct" => {}
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
          "c1" => {
            :_data => { :type => "cat", :_id => "c1", :name => "North" }
          },
          "c2" => {
            :_data => { :type => "cat", :_id => "c2", :name => "South" }
          },
          "c3" => {
            :_data => { :type => "cat", :_id => "c3", :name => "East" }
          },
          "c4" => {
            :_data => { :type => "cat", :_id => "c4", :name => "West" }
          },
          "c5" => {
            :_data => { :type => "cat", :_id => "c5", :name => "Central" }
          },
          "c6" => {
            :_data => { :type => "cat", :_id => "c6", :name => "Downtown" }
          }
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
        "struct" => {}
      },

      {
        :wtype => 'category',
        :wsubtype => "products",
        :catTypeName => "Category",
        :itemTypeName => "Product",
        :singleton => true,
        "struct" => {}
      },

      {
        :wtype => 'category',
        :wsubtype => "menu",
        :catTypeName => "Category",
        :itemTypeName => "Item",
        :singleton => true,
        "struct" => {
          "c1" => {
            :_data => { :type => "cat", :_id => "c1", :name => "Appetizers" }
          },
          "c2" => {
            :_data => { :type => "cat", :_id => "c2", :name => "Breakfast" }
          },
          "c3" => {
            :_data => { :type => "cat", :_id => "c3", :name => "Lunch" }
          },
          "c4" => {
            :_data => { :type => "cat", :_id => "c4", :name => "Dinner" }
          },
          "c5" => {
            :_data => { :type => "cat", :_id => "c5", :name => "Drinks" }
          }
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
