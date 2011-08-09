module ApplicationHelper

  def widget_docs
    CouchDocs.all.to_json
  end

  def widgets_dir(*path_ext)
    File.join Rails.root, 'public/javascripts/widgets', *path_ext
  end
  
  def company_types
    CompanyType.all.map {|t| [t.name, t[:id]]}
  end

  def carrier_names
    Carrier.all.map {|c| c.name}.sort!
  end

  def s3_base_path
    config = Rails.application.config
    "#{config.s3_base_path}/#{config.logo_s3_bucket}"
  end

  def topline_notice
    render :partial => 'shared/topline-notice', :locals => { :notice => notice, :alert => alert }
  end
end
