require 'rubygems'
require "nokogiri"
require 'open-uri'
require 'date'
require "./lib/kickstarter/version"
require "./lib/kickstarter/project"


module Kickstarter
  BASE_URL = "http://kickstarter.com"  
  
  Categories = {
    :art         => "art",
    :comics      => "comics",
    :dance       => "dance",
    :design      => "design",
    :fashion     => "fashion",
    :film_video  => "film%20&%20video",
    :food        => "food",
    :games       => "games",
    :music       => "music",
    :photography => "photography",
    :technology  => "technology",
    :theatre     => "theater",
    # :writing     => "writing%20&%20publishing"
  }
  
  Type = {
    :recommended => 'recommended', 
    :popular     => 'popular', 
    :successful  => 'successful'
  }
  
  Lists = {
    :recommended       => "recommended",
    :popular           => "popular",
    :recently_launched => "recently-launched",
    :ending_soon       => "ending-soon",
    :small_projects    => "small-projects",
    :most_funded       => "most-funded",
    :curated           => "curated-pages",
  }

  Cities = {
    :New_York      => "new-york-ny",
    :Los_Angeles   => "los-angeles-ca",
    :Brooklyn      => "brooklyn-ny",
    :Chicago       => "chicago-il",
    :San_Francisco => "san-francisco-ca",
    :Portland      => "portland-or",
    :Seattle       => "seattle-wa",
    :Austin        => "austin-tx",
    :Boston        => "boston-ma",
    :Nashville     => "nashville-tn",
  }
   
  # by category
  # /discover/categories/:category/:subcategories 
  #  :type # => [recommended, popular, successful]
  def self.by_category(category, options = {})
    path = File.join(BASE_URL, 'discover/categories', Categories[category.to_sym], Type[options[:type] || :popular])
    list_projects(path, options)
  end
  
  # by lists
  # /discover/:list
  def self.by_list(list, options = {})
    path = File.join(BASE_URL, 'discover', Lists[list.to_sym])
    list_projects(path, options)
  end

  # by cities
  # /discover/:cities
  def self.by_citiesfunding(cities, options = {})
    path = File.join(BASE_URL, 'discover/cities', Cities[cities.to_sym])
    list_fundingprojects(path, options)
  end
  
  # def self.by_citiesfunded(cities, options = {})
  #   path = File.join(BASE_URL, 'discover/cities', Cities[cities.to_sym])
  #   list_fundedprojects(path, options)
  # end


  private
  
  def self.list_projects(url, options = {})
    pages = options.fetch(:pages, 0)
    pages -= 1 unless pages == 0 || pages == :all

    start_page = options.fetch(:page, 1)
    end_page   = pages == :all ? 10000 : start_page + pages

    results = []

    (start_page..end_page).each do |page|
      retries = 0
      begin
        doc = Nokogiri::HTML(open("#{url}?page=#{page}"))
        nodes = doc.css('.project')
        break if nodes.empty?

        nodes.each do |node|
          results << Kickstarter::Project.new(node)
        end
      rescue Timeout::Error
        retries += 1
        retry if retries < 3
      end
    end
    results
  end

  def self.list_fundingprojects(url, options = {})
    pages = options.fetch(:pages, 0)
    pages -= 1 unless pages == 0 || pages == :all

    start_page = options.fetch(:page, 1)
    end_page   = pages == :all ? 10000 : start_page + pages

    results = []

    (start_page..end_page).each do |page|
      retries = 0
      begin
        doc = Nokogiri::HTML(open("#{url}?/successful=#{page}"))
        puts doc
        nodes = doc.css('.project')
        break if nodes.empty?

        nodes.each do |node|
          results << Kickstarter::Project.new(node)
        end
      rescue Timeout::Error
        retries += 1
        retry if retries < 3
      end
    end
    results
  end

  # def self.list_fundedprojects(url, options = {})
  #   pages = options.fetch(:pages, 0)
  #   pages -= 1 unless pages == 0 || pages == :all

  #   start_page = options.fetch(:page, 1)
  #   end_page   = pages == :all ? 10000 : start_page + pages

  #   results = []

  #   (start_page..end_page).each do |page|
  #     retries = 0
  #     begin
  #       doc = Nokogiri::HTML(open("#{url}?/successful=#{page}"))
  #       nodes = doc.css('.project')
  #       break if nodes.empty?

  #       nodes.each do |node|
  #         results << Kickstarter::Project.new(node)
  #       end
  #     rescue Timeout::Error
  #       retries += 1
  #       retry if retries < 3
  #     end
  #   end
  #   results
  # end

end
