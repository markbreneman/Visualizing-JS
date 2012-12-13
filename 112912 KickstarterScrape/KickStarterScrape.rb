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
	
	# => returns back an array of projects from the cities/cityname/successful
	# nyProjects = Kickstarter.by_citiesfunded(:New_York,:page => 1, :pages=> 1)

	nyProjects = Kickstarter.by_citiesfunded(:New_York,:page => 1, :pages=> 1)
	laProjects = Kickstarter.by_citiesfunded(:Los_Angeles,:page => 1, :pages=> 1)
	# bkProjects = Kickstarter.by_citiesfunded(:Brooklyn,:page => 1, :pages=> 1)
	# chProjects = Kickstarter.by_citiesfunded(:Chicago,:page => 1, :pages=> 1)
	# sfProjects = Kickstarter.by_citiesfunded(:San_Francisco,:page => 1, :pages=> 1)
	# poProjects = Kickstarter.by_citiesfunded(:Portland,:page => 1, :pages=> 1)
	# seProjects = Kickstarter.by_citiesfunded(:Seattle,:page => 1, :pages=> 1)
	# auProjects = Kickstarter.by_citiesfunded(:Austin,:page => 1, :pages=> 1)
	# boProjects = Kickstarter.by_citiesfunded(:Boston,:page => 1, :pages=> 1)
	# naProjects = Kickstarter.by_citiesfunded(:Nashville,:page => 1, :pages=> 1)

	
	totalProjects = nyProjects+laProjects
	# totalProjects = nyProjects+laProjects+bkProjects+chProjects+sfProjects+poProjects+seProjects+auProjects+boProjects+naProjects


	# puts totalProjects
	 # puts JSON.parse(projects)
	counter=1
	linksArray=Array.new
	link = Array.new(15, Hash.new)
	link.each do |link|
	linkobject=Hash.new	
	linkobject["source"]=0;
	linkobject["target"]=counter;
	linkobject["value"]=1;
	counter+=1
	linkobject.to_json
	linksArray.push linkobject
	# puts linksArray
	end
    
    counter=17
	link2 = Array.new(15, Hash.new)
	link2.each do |link|
	linkobject=Hash.new	
	linkobject["source"]=16;
	linkobject["target"]=counter;
	linkobject["value"]=1;
	counter+=1
	linkobject.to_json
	linksArray.push linkobject
	end

	linksJSON=Hash.new 
	linksJSON["links"]=linksArray
	@links=linksJSON.to_json
	
	

#############This where we start going through all the projects and creating the nodes array########	
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
	 projectobject["group"]=1
	elsif project.location=="Los Angeles, CA"
	projectobject["group"]=2
	# elsif project.location=="Brooklyn, NY"
	# projectobject["group"]=3
 #    elsif project.location=="Chicago, IL"
	# projectobject["group"]=4
	# elsif project.location=="San Francisco, CA"
	# projectobject["group"]=5
	# elsif project.location=="Portland, OR"
	# projectobject["group"]=6
	# elsif project.location=="Seattle, WA"
	# projectobject["group"]=7
	# elsif project.location=="Austin, TX"
	# projectobject["group"]=8
	# elsif project.location=="Boston, MA"
	# projectobject["group"]=9
	# elsif project.location=="Nashville, TN"
	# projectobject["group"]=10
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


laobject=Hash.new
 	laobject["name"]="Los Angeles"
	 laobject["url"]="http://www.kickstarter.com/discover/cities/los-angeles-la/successful"
	 laobject["pledge_amount"]=total_pledged
	 laobject["pledge_percent"]=average_pledged
	 laobject["location"]="New York, NY"
	 laobject["group"]="2"
	projectsArray.insert(16, laobject)
    
    totalProjectsJSON["nodes"]=projectsArray
    totalProjectsJSON["links"]=linksArray
    
  @projects=totalProjectsJSON.to_json
  
  erb :data
end