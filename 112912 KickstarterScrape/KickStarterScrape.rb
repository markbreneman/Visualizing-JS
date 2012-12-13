require './lib/kickstarter'
require 'sinatra'
require 'rubygems'
require 'json'

# class Project
  # include DataMapper::Resource
 #  property :name, String
 #  property :handle, String
 #  property :description, Text
 #  property :owner, Text
 #  property :pledge_amount, Text
 #  property :pledge_percent, Text
 #  property :pledge_deadline, Text
 #  property :thumbnail_url, Text
 # end

class Project 
def initialize(name,handle,description,owner,pledge_amount,pledge_percent,pledge_deadline,thumbnail_url)
	@name= name
	@handle= handle
	@owner=owner
	@url=url
	@description=description
	@pledge_amount=pledge_amount
	@pledge_percent=pledge_percent
	@pledge_deadline=pledge_deadline
	@thumbnail_url=thumbnail_url
	@location=location
 end
end


get '/' do
	
erb :KickstarterForceGraph
end

get '/data' do

	# projects = Kickstarter.by_category(:technology,:page => 1, :pages=> 1)
	# => returns back an array of projects from the category/popular
	
	# projects = Kickstarter.by_citiesfunding(:San_Francisco,:page => 1, :pages=> 1)
	# => returns back an array of projects from the cities/cityname/funding
	projects = Kickstarter.by_citiesfunded(:New_York,:page => 1, :pages=> 1)
	sfprojects = Kickstarter.by_citiesfunded(:San_Francisco,:page => 1, :pages=> 1)
	# => returns back an array of projects from the cities/cityname/successful
	totalProjects = projects+sfprojects 
	# puts totalProjects
	 # puts JSON.parse(projects)
	links = Array.new(15, Hash.new)
	# links=[
 #    {"source":1,"target":0,"value":1},
 #    {"source":2,"target":0,"value":8},
 #    {"source":3,"target":0,"value":10},
 #    {"source":3,"target":2,"value":6},
 #    {"source":4,"target":0,"value":1},
 #    {"source":5,"target":0,"value":1},
 #    {"source":6,"target":0,"value":1},
 #    {"source":7,"target":0,"value":1},
 #    {"source":8,"target":0,"value":2},
 #    {"source":9,"target":0,"value":1},
 #    {"source":11,"target":10,"value":1},
 #    {"source":11,"target":3,"value":3},
 #    {"source":11,"target":2,"value":3},
 #    {"source":11,"target":0,"value":5},
 #    {"source":12,"target":11,"value":1},
 #  ]

	projectsArray=Array.new

	
	total_pledged=0
	total_pledgedpercent=0

	totalProjectsJSON=Hash.new  
	totalProjects.each do |project|
	 projectobject=Hash.new 
	 projectobject["name"]=project.name
	 projectobject["handle"]=project.handle
	 projectobject["owner"]=project.owner
	 projectobject["url"]=project.url
	 projectobject["pledge_amount"]=project.pledge_amount
	 projectobject["pledge_deadline"]=project.pledge_deadline
	 projectobject["pledge_percent"]=project.pledge_percent
	 projectobject["thumbnail_url"]=project.thumbnail_url
	 projectobject["location"]=project.location

	 if project.location=="New York, NY"
	 projectobject["group"]="1"
	elsif project.location=="San Francisco, CA"
	projectobject["group"]="2"
	 end	
	 
	 total_pledged+=projectobject["pledge_amount"]
	 total_pledgedpercent += projectobject["pledge_percent"]
	 projectobject.to_json
	 projectsArray.push projectobject
	end

	average_pledged=total_pledgedpercent/projectsArray.length
   
    newyorkobject=Hash.new
 	newyorkobject["name"]="New York"
	 newyorkobject["url"]="http://www.kickstarter.com/discover/cities/new-york-ny/successful"
	 newyorkobject["pledge_amount"]=total_pledged
	 newyorkobject["pledge_percent"]=average_pledged
	 newyorkobject["location"]="New York, NY"
	 newyorkobject["group"]="1"
	projectsArray.insert(0, newyorkobject)

    
    totalProjectsJSON["nodes"]=projectsArray
	# # projectsJSON["links"]=links
	
  # @projects=projects	
  @projects=totalProjectsJSON.to_json
  



  erb :data
end