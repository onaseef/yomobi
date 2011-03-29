module BuilderHelper

  def active?(name,var)
    'active' if var == name
  end
  
  def long_day_name(day)
    @long_names ||= %w(Sunday Monday Tuesday Wednesday Thursday Friday Saturday)
    @long_names.select {|d| d.downcase.match /^#{day}/}.first
  end
end
