class CouchDocs
  require 'digest/sha1'
  
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
  
  def self.worder_doc
    {
      "_id" => "worder",
      "worder" => {
        "business-hours" => 0,
        "call-us" => 1,
        "find-us" => 2,
        "about-us" => 3
      },
      "wtabs" => ['','','']
    }
  end
  
  def self.about_us_doc(desc)
    {
      "name" => "about-us",
      "wtype" => "custom_page",
      "helpText" => "A page describing what your business is about.",
      "content" => desc,
      "singleton" => true
    }
  end
  
  def self.phone_doc(phone)
    {
      "name" => "call-us",
      "wtype" => "phone",
      "helpText" => "Add a number for one-click calling.",
      "phone" => phone
    }
  end
  
  def self.gmap_doc(address)
    {
      "name" => "find-us",
      "wtype" => "gmap",
      "helpText" => "Show your customers a map of where your business is located.",
    }.merge!(address)
  end
  
  def self.hours_doc
    {
      "name" => "widget-hours",
      "wtype" => "hours",
      "helpText" => "Let your customers know when you're open for business."
    }
  end
  
  def self.gen_salt
    lengths = [[48,10],[97,26]]
    result = ""
    32.times { type = lengths[rand 2]; result += (type[0] + (rand type[1])).chr }
    result
  end
end
