require 'sinatra'
require 'uri'
require 'sqlite3'
require 'securerandom'

db = SQLite3::Database.new "main.db"
# db.results_as_hash = true

Templates = db.execute("SELECT templates FROM templates").map do |row|
  JSON.parse(row.first, {symbolize_names: true})
end

# p Templates

get '/memegenerator' do
  @title = 'Meme Generator'
  @templates = Templates
  template = @templates[2]
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

post '/add' do
  file = params["image"]["tempfile"].read
  ext = File.extname(params["image"]["filename"])
  file_name = SecureRandom.hex(3) + ext

  File.write("public/media/#{file_name}", file)

  "200"
end