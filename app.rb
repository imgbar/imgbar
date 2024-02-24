require 'sinatra'
require 'uri'
require 'sqlite3'
require 'securerandom'

db = SQLite3::Database.new "main.db"

define_method :get_templates do
  db.execute("SELECT templates FROM templates").map do |row|
    JSON.parse(row.first, {symbolize_names: true})
  end
end

get '/memegenerator' do
  templates = get_templates
 
  @title = 'Meme Generator'
  @templates = templates
  template = @templates[0]
  @selected_template_json = template.to_json

  erb :generator
end

get '/template/:id' do
  templates = get_templates
  @template = templates.find { |t| t[:id] == params[:id].to_i }

  content_type 'application/json'
  @template.to_json
end

post '/search' do
  request.body.rewind
  data = URI.decode_www_form(request.body.read)
  search_query = data.assoc('search').last.downcase
  results = @templates.filter do |t| 
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
  file_path_relative = "/media/#{file_name}"
  file_path = "public#{file_path_relative}"

  File.write(file_path, file)
  templates = {id: rand(10..50), imagePath: file_path_relative, title: 'foobar', texts: []}

  db.execute("INSERT INTO templates (templates) VALUES(?)", [templates.to_json.to_s])

  "200"
end