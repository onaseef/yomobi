class CompanyType < ActiveRecord::Base
  has_many :companies

  def og_type_name
    self.name.downcase.gsub(' ', '_').gsub /[^a-z0-9\._]/, ''
  end
end
