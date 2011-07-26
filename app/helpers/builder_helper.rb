module BuilderHelper

  def active?(name,var)
    'active' if var == name
  end
  
  def long_day_name(day)
    @long_names ||= %w(Sunday Monday Tuesday Wednesday Thursday Friday Saturday)
    @long_names.select {|d| d.downcase.match /^#{day}/}.first
  end

  def desktop_redirect_code(company)
    %Q{<!-- Place this tag in the head tag of your website -->\
    <script type="text/javascript" src="http://detect.deviceatlas.com/redirect.js?m=#{company.mobile_url}"></script>}
  end
end
