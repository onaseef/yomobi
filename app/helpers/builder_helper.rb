module BuilderHelper

  def active?(name,var)
    'active' if var == name
  end

  def long_day_name(day)
    @long_names ||= %w(Sunday Monday Tuesday Wednesday Thursday Friday Saturday)
    day = @long_names.select {|d| d.downcase.match /^#{day}/}.first
    I18n.t("days.#{day}")
  end

  def desktop_redirect_code(company)
    %Q{<!-- Copy these lines to your website's homepage. -->
<script type="text/javascript">var _RSITE = '#{escape_javascript company.mobile_url}';</script>
<script type="text/javascript" src="http://www.yomobi.com/javascripts/mobile-redirect.js"></script>}
  end

  def help_texts
    I18n.t('widgets').to_json
  end

  def widget_meta
    WMETA.to_json
  end

  def widget_icons
    icon_names = WICONS_cache[I18n.locale]
    if icon_names.nil?
      # lazy load locale
      icon_names = WICONS_cache[I18n.locale] = WICONS.map {|i|
        next if i.nil?
        i.merge :pname => I18n.t("widgets.icons.#{ i['name'] || i['separator'] }")
      }
    end
    icon_names.to_json
  end

  def image_size_options
    result = []
    10.times do |i|
      v = (10 - i) * 10
      result.push ["#{v}",v]
    end
    result
  end

  def is_tab_bar_visible?
    return !current_user.company.company_settings.tab_bar_visible
  end

  def is_footer_bar_visible?
    return !current_user.company.company_settings.footer_bar_visible
  end

end
