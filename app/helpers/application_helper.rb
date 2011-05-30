module ApplicationHelper

  def widgets_dir(*path_ext)
    File.join Rails.root, 'public/javascripts/widgets', *path_ext
  end
  
  def business_types
    %w{
    Personal
    Local\ Business
    Automotive
    Automotive\ Dealer\ /\ Vehicle
    Service
    Banking\ and\ Financial\ Service
    Bar
    Cafe
    Club
    Convention\ Center\ and\ Sports
    Complex
    Education
    Event\ Planning\ Service
    Grocery
    Health\ and\ Beauty
    Library\ /\ Public\ Building
    Medical\ Service
    Museum\ /\ Attraction
    Park
    Pest
    Profesional\ Service
    Real\ Estate
    Religious\ Center
    Restaurant
    Store
    Technology\ and\ Telecommunications\ Service
    Travel\ Service
    }
  end

  def carrier_names
    Carrier.all.map {|c| c.name}
  end
end
