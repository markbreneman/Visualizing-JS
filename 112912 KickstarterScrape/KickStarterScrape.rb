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
	@description=description
	@owner=owner
	@pledge_amount=pledge_amount
	@pledge_percent=pledge_percent
	@pledge_deadline=pledge_deadline
	@thumbnail_url=thumbnail_url
 end
end


get '/' do
	# projects = Kickstarter.by_category(:technology,:page => 1, :pages=> 1)
	# => returns back an array of projects from the category/popular
	# projects = Kickstarter.by_category(:technology,:page => 1, :pages=> 1)
	projects = Kickstarter.by_citiesfunding(:San_Francisco,:page => 1, :pages=> 1)
	
	 # puts JSON.parse(projects)


	count=0
	projectsJSON=Hash.new 
	projects.each do |project|
	 projectobject=Hash.new 
	 projectobject["name"]=project.name
	 projectobject["handle"]=project.handle
	 projectobject["url"]=project.url
	 projectobject["pledge_amount"]=project.pledge_amount
	 projectobject["pledge_deadline"]=project.pledge_deadline
	 projectobject["pledge_percent"]=project.pledge_percent
	 projectobject["thumbnail_url"]=project.thumbnail_url
	 projectobject.to_json
	 count+=1
	 projectsJSON[count]=projectobject
	end

	# projects.each do |project|
	# 	puts project.name
	# end


	# @projects=projects[1].name
	# render :json => @projects.to_json

  @projects=projectsJSON.to_json
  erb :main

end
