module ApplicationHelper

  def widget_docs
    CouchDocs.all.to_json
  end

  def widgets_dir(*path_ext)
    File.join Rails.root, 'public/javascripts/widgets', *path_ext
  end
  
  def company_types
    types = CompanyType.all

    # move stuff to the top of the list
    local_idx = types.find_index {|t| t.name == 'Local / Small Business'}
    types.insert 0, types.delete_at(local_idx)

    types.map {|t| [t.name, t[:id]]}
  end

  def carrier_names
    Carrier.all.map {|c| c.name}.sort! do |x,y|
      if x.include?('Canadian') && !y.include?('Canadian')
        1
      elsif !x.include?('Canadian') && y.include?('Canadian')
        -1
      else
        x <=> y
      end
    end
  end

  def s3_base_path
    config = Rails.application.config
    "#{config.s3_base_path}/#{config.logo_s3_bucket}"
  end

end
