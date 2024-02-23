require 'sinatra'
require 'uri'
require_relative 'data.rb'

get '/memegenerator' do
  @title = 'Meme Generator'
  @templates = Templates
  template = @templates[rand(0..@templates.length - 1)]
  @selected_template_json = template.to_json

  erb :generator
end

get '/memegenerator/:template' do
  @templates = Templates
  p params[:template]
  template = @templates.find { |t| t[:slug] == params[:template]}

  @title = "#{template[:title]} Meme Generator"
  @selected_template_json = template.to_json

  erb :generator
end

get '/template/:id' do
  @template = Templates[params[:id].to_i]

  content_type 'application/json'
  @template.to_json
end

post '/search' do
  request.body.rewind
  data = URI.decode_www_form(request.body.read)
  search_query = data.assoc('search').last.downcase
  results = Templates.filter do |t| 
    t[:title].downcase.include?(search_query) 
  end

  return "<p>No results found</p>" if results.length == 0

  results.map do |result|
    "<div data-id='#{result[:id]}' class='search-result'>
      <img src='#{result[:imagePath]}' />
      <p>#{result[:title]}</p>
    </div>"
  end
end