Bundler.require
require "active_support/core_ext"

class SocketServer < Sinatra::Base
  set :root, Bundler.root


  configure do
    # See: http://www.sinatrarb.com/faq.html#sessions
    enable :sessions
    set :session_secret, ENV['SESSION_SECRET'] || 'this is a secret shhhhh'

  end

  set connections: []
  set users: ["Admin"]

  get '/' do
    erb :index
  end

  get '/stream' do
    content_type "text/event-stream"
    stream :keep_open do |connection|
      settings.connections << connection
      connection.callback { settings.connections.delete(connection) }
    end
  end

  post '/messages' do
    publish_message(params)
    204
  end

  post '/users' do
    settings.users << params[:user]
    settings.users.uniq!
    publish_message(name: "Admin", msg: "#{params[:user]} has entered the room!")
    publish_users
    204
  end

  delete '/users' do
    settings.users.delete(params[:user])
    publish_message(name: "Admin", msg: "#{params[:user]} has left the room!")
    publish_users
    204
  end

  def publish_message(message)
    settings.connections.each { |out| out << "data: #{{message: message}.to_json}\n\n" }
  end

  def publish_users
    settings.connections.each { |out| out << "data: #{{users: settings.users}.to_json}\n\n" }
  end

end