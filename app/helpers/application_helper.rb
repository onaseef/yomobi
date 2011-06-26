module ApplicationHelper

  def widgets_dir(*path_ext)
    File.join Rails.root, 'public/javascripts/widgets', *path_ext
  end
  
  def business_types
    CompanyType.all.map {|t| t.name}
  end

  def carrier_names
    Carrier.all.map {|c| c.name}
  end
end
