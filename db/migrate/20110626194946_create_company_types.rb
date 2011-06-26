class CreateCompanyTypes < ActiveRecord::Migration
  def self.up
    create_table :company_types do |t|
      t.string :name

      t.timestamps
    end
    add_index :company_types, :name, :unique => true

    # Populate table
    CompanyType.reset_column_information()
    %w{
    Local\ Business
    Personal
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
    }.each do |type_name|
      CompanyType.create :name => type_name
    end
  end

  def self.down
    drop_table :company_types
  end
end
