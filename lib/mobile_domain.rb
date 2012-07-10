class MobileDomain
  def self.matches?(request)
    self.get_mobile_reference(request) != false
  end

  # Returns a string if yomobi subdomain
  # Returns a company_id if custom domain
  # Returns false otherwise
  def self.get_mobile_reference(request)
    if request.host =~ /(?:#{ Rails.application.config.re_app_domains })$/
      return false if request.subdomain == "www" || request.subdomain.blank?
      return request.subdomain
    else
      domain = Domain.find_by_host(request.host)
      puts "UNRECOGNIZED HOST: #{request.host}"
      puts "CUSTOM DOMAIN: #{domain.inspect}"
      if domain && domain.company_id && domain.company.premium? == false
        return "redirect:#{domain.company.db_name}"
      else
        return domain && domain.company_id
      end
    end
  end
end
