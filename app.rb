require 'sinatra'
require 'json'
require 'uri'
require_relative 'memeTemplates.rb'

templates = MemeTemplates::TEMPLATES

get '/' do
  @title = 'Meme Generator'
  @templates = templates
  template = templates[rand(0..@templates.length - 1)]
  @selected_template_json = template.to_json

  erb :generator
end

get '/:template' do
  template = templates.find { |t| t[:slug] == params[:template]}

  @title = "#{template[:title]} Meme Generator"
  @templates = templates
  @selected_template_json = template.to_json

  erb :generator
end

get '/template/:id' do
  @template = templates[params[:id].to_i]

  content_type 'application/json'
  @template.to_json
end

post '/search' do
  request.body.rewind
  data = URI.decode_www_form(request.body.read)
  search_query = data.assoc('search').last.downcase
  template_titles = templates.map { |t| t[:title].downcase }
  results = templates.filter do |t| 
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