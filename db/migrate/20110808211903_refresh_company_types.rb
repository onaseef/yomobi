class RefreshCompanyTypes < ActiveRecord::Migration
  def self.up
    CompanyType.all.each {|t| t.destroy}
    CompanyType.reset_column_information()

    # new company types
    %w{
    Airport
    Arts\ /\ Entertainment\ /\ Nightlife
    Attractions\ /\ Things\ to\ Do
    Automotive
    Bank\ /\ Financial\ Services
    Bar
    Book\ Store
    Business\ Services
    Church\ /\ Religious\ Organization
    Club
    Community\ /\ Government
    Computers\ /\ Technology
    Concert\ Venue
    Consulting\ /\ Business\ Services
    Education
    Energy\ /\ Utility
    Engineering\ /\ Construction
    Event\ Planning\ /\ Event\ Services
    Food\ /\ Grocery
    Government\ Organization
    Heath\ /\ Medical\ /\ Pharmacy
    Home\ Improvement
    Hospital\ /\ Clinic
    Hotel
    Individual\ /\ Personal\ Site
    Insurance\ Company
    Internet\ /\ Software
    Legal\ /\ Law
    Library
    Local\ /\ Small\ Business
    Media\ /\ News\ /\ Publishing
    Movie\ Theater
    Museum\ /\ Art\ Gallery
    Non-Governmental\ Organization\ (NGO)
    Organization
    Pet\ Services
    Political\ Party\ /\ Organization
    Professional\ Services
    Public\ Places
    Real\ Estate
    Restaurant\ /\ Cafe
    Retail\ and\ Consumer\ Merchandise
    School
    Shopping\ /\ Retail
    Spas\ /\ Beauty\ /\ Personal\ Care
    Sports\ Venue
    Sports\ /\ Recreation\ /\ Activities
    Tours\ /\ Sightseeing
    Transit\ Stop
    Transportation
    Travel\ /\ Leisure
    University
    Other
    }.each do |type_name|
      CompanyType.create :name => type_name
    end
  end

  def self.down
  end
end
