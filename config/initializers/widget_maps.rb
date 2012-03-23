WMAPS  = YAML.load_file "#{::Rails.root}/config/widget_maps.yml"
WICONS = YAML.load_file "#{::Rails.root}/config/widget_icons.yml"
WMETA  = YAML.load_file "#{::Rails.root}/config/widget_meta.yml"

WMAPS_cache = {}
WICONS_cache = {}
WMETA_cache = {}
