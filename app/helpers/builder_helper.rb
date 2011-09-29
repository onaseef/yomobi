module BuilderHelper

  def active?(name,var)
    'active' if var == name
  end
  
  def long_day_name(day)
    @long_names ||= %w(Sunday Monday Tuesday Wednesday Thursday Friday Saturday)
    @long_names.select {|d| d.downcase.match /^#{day}/}.first
  end

  def desktop_redirect_code(company)
    %Q{<!-- Place these tags in the head tag of your website -->
<script type="text/javascript">var _RSITE = '#{escape_javascript company.mobile_url}';</script>
<script type="text/javascript" src="http://www.yomobi.com/javascripts/mobile-redirect.js"></script>}
  end

  def help_texts
    I18n.t('widgets').to_json
  end
end
