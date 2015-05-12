
class StravaController < ApplicationController
  
  include ActionView::Helpers::TextHelper

  def home

  end
 
  def running_stats
    @client = Strava::Api::V3::Client.new(access_token: session[:access_token])
    @runs = list_all_activities(@client)
  end
  
  def strava
  #http://rails-tutorial-gkrathwohl.c9.io
	redirect = 'http://localhost:3000'
    @url = 'https://www.strava.com/oauth/authorize?client_id=3764&response_type=code&redirect_uri='+redirect+'/authen&scope=write&approval_prompt=force'
  end
 

 
 
 
 
 private 
 
 	def authen
		client_params = {
		  "client_id" => "3764",
		  "client_secret" => "e0b897e6bc461b774c73fbff6936f656d2e376f3",
		  "code" => params[:code],
		}
		result = post_api_call("https://www.strava.com/oauth/token", client_params)
		logger.debug("result")
		logger.debug(result["access_token"])
		session[:access_token] = result["access_token"]
	end
	
	def rename
		rename_mornings
		# create_activity
		
		# http = Net::HTTP.new('https://www.strava.com/', port)
		# response = http.send_request('PUT', '/path/from/host?id=id&option=enable|disable')
		
		# redirect_to 'authen'
		# flash[:success] = @results.count.to_s + " activities renamed" 
		flash[:success] = pluralize(@results.count, "activity") + " renamed"
	end
	
	
	def hash(activity, options)
		h = {}
		options.each do |option|
		  h[option] = activity[option]
		end
		return h
	end
	
	def create_activity
		@client = Strava::Api::V3::Client.new(access_token: session[:access_token])

		@activities = [];
		@results = [];

		u_params = {
		  "access_token"=> session[:access_token], 
		  "name" => "new activity", 
		  "description" =>	"updated!",
		  "elapsed_time" => 1230,
		  "start_date_local" => "2013-12-01T10:02:13Z",
		  "distance" => 155,
		  "type" => "Ride"
		}
		# u_params = {name: "Morn Run"}
		options = {}
		result1 = put_api_call('https://www.strava.com/api/v3/activities', u_params)
		# result = @client.api_call("activities/", u_params, 'post', u_params)
		# @results.push result
		@results.push result1
		logger.debug("hi greggo")
		logger.debug(result1)
	end
	
	def street_name(activity)
		# sleep so api doesn't error when renaming lots
		sleep 0.05
		lat = activity['start_latitude']
		lon = activity['start_longitude']
		if lat != nil && lon != nil && lat != "" && lon != ""
		  url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=#{lat},#{lon}&key=AIzaSyC5W6cokeTTdRr6x40q-DzU_5BXbY1TOAs"
		  rest = get_api_call(url)
		  res = rest["results"][0]
		  if res != nil
			res['address_components'].each do |address|
			  if address['types'][0] == "route"
				return address['short_name']
			  end
			end
			return nil
			# @addresses.push(@url)
			# @addresses.push(@geo)
		  else
			@addresses.push(url)
			@addresses.push(rest)
			return nil
		  end
		  
		  return "Manual Activity"
		end
	end
	
	def post_api_call(url, u_params)
      uri = URI.parse(url)
      uri.query = URI.encode_www_form(u_params)
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true
      http.verify_mode = OpenSSL::SSL::VERIFY_NONE
      request = Net::HTTP::Post.new(uri.request_uri)
      JSON.parse http.request(request).body
    end
    
    def put_api_call(url, u_params)
      uri = URI.parse(url)
      uri.query = URI.encode_www_form(u_params)
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true
      http.verify_mode = OpenSSL::SSL::VERIFY_NONE
      request = Net::HTTP::Put.new(uri.request_uri)
      http.request(request).body
    end
    
    def get_api_call(url, u_params = {})
      uri = URI.parse(url)
      uri.query = URI.encode_www_form(u_params)
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true
      http.verify_mode = OpenSSL::SSL::VERIFY_NONE
      request = Net::HTTP::Get.new(url)
      JSON.parse http.request(request).body
    end
    
    def get_api_call_a(url, u_params)
      uri = URI.parse(url)
      uri.query = URI.encode_www_form(u_params)
      http = Net::HTTP.new(uri.host, uri.port)
      # http.use_ssl = true
      # http.verify_mode = OpenSSL::SSL::VERIFY_NONE
      request = Net::HTTP::Get.new(url)
      request.add_field('token','QPgIGoMZSwrruMvlrYBSebBNHDBnbCgj')
      JSON.parse http.request(request).body
    end

	  def earth_all
    @client = Strava::Api::V3::Client.new(access_token: session[:access_token])
    @runs = list_all_activities(@client)
  end
  
  def earth
    @hi = session[:access_token]
    u_params = {
          "access_token"=> session[:access_token],
        }
    # result = get_api_call('https://www.strava.com/api/v3/activities/' + params[:id].to_s + "/streams/latlng", u_params)
    result = get_api_call('http://app.strava.com/stream/' + params[:id].to_s)
    @data = result['latlng']
    
  end
  

  
  def weather_description
    token = 'QPgIGoMZSwrruMvlrYBSebBNHDBnbCgj'
    token_param = { "token"=> token }
    datasetid = 'GHCND'
    locationid = 'FIPS:02'
    startdate = '2010-05-01'
    enddate = '2010-05-31'
    @result = get_api_call_a('http://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid='+ datasetid +'&locationid='+ locationid +'&startdate='+ startdate +'&enddate='+enddate, token_param)
  end
  
  def rename_mornings
    logger.debug( "token:" )
    logger.debug( session[:access_token])
    @client = Strava::Api::V3::Client.new(access_token: session[:access_token])

    @activities = []
    @results = []
    @addresses = []
  
    # go through each activity
    list_all_activities(@client).each do |activity|
    # @client.list_athlete_activities(page: 1, per_page:10).each do |activity|
      n = activity['name']
      
      # url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=#{activity['start_latitude']},#{activity['start_longitude']}&key=AIzaSyC5W6cokeTTdRr6x40q-DzU_5BXbY1TOAs"
      # @addresses.push(url)
      
      # if default name, rename as road.
      if n == "Afternoon Run" || n=="Morning Run" || n == "Lunch Run" || n == "Evening Run" || n == "Morning Ride" || n == "Lunch Ride" || n == "Evening Ride"
        logger.debug("should update")
        
        new_name = street_name(activity)
        
        # new_name = "street"
        if new_name == nil then new_name = n end
        u_params = {
          "access_token"=> session[:access_token], 
          "name" => new_name, 
          "description" =>	"updated!",
        }
        result = put_api_call('https://www.strava.com/api/v3/activities/' + activity['id'].to_s, u_params)
        @results.push result
      end
    end
  end
  
  def list_all_activities(client)
    all_activities = []
    curr_page = 1
    curr_results = client.list_athlete_activities(page: curr_page, per_page:200)
    while curr_results.count > 0
      curr_results.each do |activity|
        all_activities.push activity
      end
      curr_page += 1
      curr_results = client.list_athlete_activities(page: curr_page, per_page:200)
    end
    return all_activities
  end
  
 
 
 
end