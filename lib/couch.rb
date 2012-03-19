class Couch

  def self.couchdb_exists?(db_name)
    db = CouchRest.database "http://#{Rails.application.config.couch_host}/m_#{db_name}"
    begin
      return !db.info.nil?
    rescue RestClient::ResourceNotFound => nfe
      return false
    end
  end

end
