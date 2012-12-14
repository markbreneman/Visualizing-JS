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
	bkProjects = Kickstarter.by_citiesfunded(:Brooklyn,:page => 1, :pages=> 1)
	chProjects = Kickstarter.by_citiesfunded(:Chicago,:page => 1, :pages=> 1)
	sfProjects = Kickstarter.by_citiesfunded(:San_Francisco,:page => 1, :pages=> 1)
	poProjects = Kickstarter.by_citiesfunded(:Portland,:page => 1, :pages=> 1)
	seProjects = Kickstarter.by_citiesfunded(:Seattle,:page => 1, :pages=> 1)
	auProjects = Kickstarter.by_citiesfunded(:Austin,:page => 1, :pages=> 1)
	boProjects = Kickstarter.by_citiesfunded(:Boston,:page => 1, :pages=> 1)
	naProjects = Kickstarter.by_citiesfunded(:Nashville,:page => 1, :pages=> 1)

	
	# totalProjects = nyProjects+laProjects
	totalProjects = nyProjects+laProjects+bkProjects+chProjects+sfProjects+poProjects+seProjects+auProjects+boProjects+naProjects


	# puts totalProjects

	# counter=1
	# linksArray=Array.new
	# link = Array.new(15, Hash.new)
	# link.each do |link|
	# linkobject=Hash.new	
	# linkobject["source"]=0;
	# linkobject["target"]=counter;
	# linkobject["value"]=1;
	# counter+=1
	# linkobject.to_json
	# linksArray.push linkobject
	# # puts linksArray
	# end
    
 	# counter=17
	# link2 = Array.new(15, Hash.new)
	# link2.each do |link|
	# linkobject=Hash.new	
	# linkobject["source"]=16;
	# linkobject["target"]=counter;
	# linkobject["value"]=1;
	# counter+=1
	# linkobject.to_json
	# linksArray.push linkobject
	# end

	# linksJSON=Hash.new 
	# linksJSON["links"]=linksArray
	# @links=linksJSON.to_json
	

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
	elsif project.location=="Brooklyn, NY"
	projectobject["group"]=3
    elsif project.location=="Chicago, IL"
	projectobject["group"]=4
	elsif project.location=="San Francisco, CA"
	projectobject["group"]=5
	elsif project.location=="Portland, OR"
	projectobject["group"]=6
	elsif project.location=="Seattle, WA"
	projectobject["group"]=7
	elsif project.location=="Austin, TX"
	projectobject["group"]=8
	elsif project.location=="Boston, MA"
	projectobject["group"]=9
	elsif project.location=="Nashville, TN"
	projectobject["group"]=10
	end	
	 
	 total_pledged+=projectobject["pledge_amount"]
	 total_pledgedpercent += projectobject["pledge_percent"]
	 projectobject.to_json
	 projectsArray.push projectobject
	end

	average_pledged=total_pledgedpercent/projectsArray.length
   
   
   
  
   ###########ADD IN CITIES AS NODES###########
    nyobject=Hash.new
 	nyobject["name"]="New York"
	 nyobject["url"]="http://www.kickstarter.com/discover/cities/new-york-ny/successful"
	 nyobject["totalPledged_amount"]=total_pledged
	 nyobject["averagedPledgePercent"]=average_pledged
	 nyobject["location"]="New York, NY"
	 nyobject["group"]=1
	projectsArray.insert(0, nyobject)


	laobject=Hash.new
 	laobject["name"]="Los Angeles"
	 laobject["url"]="http://www.kickstarter.com/discover/cities/los-angeles-la/successful"
	 laobject["totalPledged_amount"]=total_pledged
	 laobject["averagedPledgePercent"]=average_pledged
	 laobject["location"]="Los Angeles, CA"
	 laobject["group"]=2
	projectsArray.insert(16, laobject)

	bkobject=Hash.new
 	bkobject["name"]="Brooklyn"
	 bkobject["url"]="http://www.kickstarter.com/discover/cities/brooklyn-ny/successful"
	 bkobject["totalPledged_amount"]=total_pledged
	 bkobject["averagedPledgePercent"]=average_pledged
	 bkobject["location"]="Brooklyn, NY"
	 bkobject["group"]=3
	projectsArray.insert(32, bkobject)

	chobject=Hash.new
 	chobject["name"]="Chicago"
	 chobject["url"]="http://www.kickstarter.com/discover/cities/chicago-il/successful"
	 chobject["totalPledged_amount"]=total_pledged
	 chobject["averagedPledgePercent"]=average_pledged
	 chobject["location"]="Chicago, IL"
	 chobject["group"]=4
	projectsArray.insert(48, chobject)

	sfobject=Hash.new
 	sfobject["name"]="San Francisco"
	 sfobject["url"]="http://www.kickstarter.com/discover/cities/san-franciso-ca/successful"
	 sfobject["totalPledged_amount"]=total_pledged
	 sfobject["averagedPledgePercent"]=average_pledged
	 sfobject["location"]="San Franciso, CA"
	 sfobject["group"]=5
	projectsArray.insert(64, sfobject)

	poobject=Hash.new
 	poobject["name"]="Portland"
	 poobject["url"]="http://www.kickstarter.com/discover/cities/portland-or/successful"
	 poobject["totalPledged_amount"]=total_pledged
	 poobject["averagedPledgePercent"]=average_pledged
	 poobject["location"]="Portland, OR"
	 poobject["group"]=6
	projectsArray.insert(80, poobject)

	seobject=Hash.new
 	seobject["name"]="Seattle"
	 seobject["url"]="http://www.kickstarter.com/discover/cities/brooklyn-ny/successful"
	 seobject["totalPledged_amount"]=total_pledged
	 seobject["averagedPledgePercent"]=average_pledged
	 seobject["location"]="Seattle, WA"
	 seobject["group"]=7
	projectsArray.insert(96, seobject)

	auobject=Hash.new
 	auobject["name"]="Austin"
	 auobject["url"]="http://www.kickstarter.com/discover/cities/austin-tx/successful"
	 auobject["totalPledged_amount"]=total_pledged
	 auobject["averagedPledgePercent"]=average_pledged
	 auobject["location"]="Austin, TX"
	 auobject["group"]=8
	projectsArray.insert(112, auobject)

	boobject=Hash.new
 	boobject["name"]="Boston"
	 boobject["url"]="http://www.kickstarter.com/discover/cities/boston-ma/successful"
	 boobject["totalPledged_amount"]=total_pledged
	 boobject["averagedPledgePercent"]=average_pledged
	 boobject["location"]="Boston, MA"
	 boobject["group"]=9
	projectsArray.insert(128, boobject)

	naobject=Hash.new
 	naobject["name"]="Nashville"
	 naobject["url"]="http://www.kickstarter.com/discover/cities/boston-ma/successful"
	 naobject["totalPledged_amount"]=total_pledged
	 naobject["averagedPledgePercent"]=average_pledged
	 naobject["location"]="Nashville, TN"
	 naobject["group"]=10
	projectsArray.insert(144, naobject)

   linksArray=Array.new
   counter=0

   # puts projectsArray
   
   for projects in projectsArray do
   	linkobject=Hash.new	
   	
   	if projects["group"]==1
	linkobject["source"]=0;
	elsif projects["group"]==2
	linkobject["source"]=16;
	elsif projects["group"]==3
	linkobject["source"]=32;
	elsif projects["group"]==4
	linkobject["source"]=48;
	elsif projects["group"]==5
	linkobject["source"]=64;
	elsif projects["group"]==6
	linkobject["source"]=80;
	elsif projects["group"]==7
	linkobject["source"]=96;
	elsif projects["group"]==8
	linkobject["source"]=112;
	elsif projects["group"]==9
	linkobject["source"]=128;
	elsif projects["group"]==10
	linkobject["source"]=144;
    end 

	linkobject["target"]=counter;
	linkobject["value"]=1;
	counter+=1
	linkobject.to_json
	linksArray.push linkobject
    end





    linksJSON=Hash.new 
	linksJSON["links"]=linksArray
	@links=linksJSON.to_json    

    totalProjectsJSON["nodes"]=projectsArray
    totalProjectsJSON["links"]=linksArray



  @projects=totalProjectsJSON.to_json
  
  erb :data
end