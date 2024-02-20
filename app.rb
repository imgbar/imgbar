require 'dotenv'
require 'sinatra'
require 'sqlite3'
require 'json'
require 'openai'
require_relative 'memeTemplates.rb'

# Dotenv.load

templates = MemeTemplates::TEMPLATES

get '/memegenerator' do
  @title = 'Meme Generator'
  @templates = templates
  template = templates[rand(0..@templates.length - 1)]
  @selected_template_json = template.to_json

  erb :generator
end

get '/memegenerator/:template' do
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

# OPENAI_API_KEY = ENV["OPENAI_API_KEY"]

# client = OpenAI::Client.new(access_token: OPENAI_API_KEY )
# system_prompt = "You are a expert dank meme maker."
# user_prompt = <<-PROMPT 
# Write a caption for the meme template of Buff Doge vs Cheems.
# Do not include any explanations, only provide a  RFC8259 compliant JSON response  following this format without deviation.
# [{
#   "meme template": "name of the meme template",
#   "texts": [
#     "first sentence for the meme template, to be written under Buff Doge",
#     "second sentence for the meme template, to be written under Cheems"
#   ]
# }]
# The JSON response:
# PROMPT

# response = client.chat(
#     parameters: {
#         model: "gpt-3.5-turbo",
#         messages: [
#           { role: "system", content: system_prompt},
#           { role: "user", content: user_prompt}
#         ], 
#         temperature: 0.7,
#     })
# puts response.dig("choices", 0, "message", "content")

# post '/generate' do 
#   return response.dig("choices", 0, "message", "content")
# end