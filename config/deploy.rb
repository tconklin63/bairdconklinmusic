# Automatic "bundle install" after deploy
require 'bundler/capistrano'
 
# Application name
set :application, "bairdconklinmusic"
 
# BlueHost SSH user
set :user, "bairdcon"
 
# App Domain
set :domain, "bairdconklinmusic.com"
 
# We don't need sudo on BlueHost
set :use_sudo, false
 
# git is our SCM
set :scm, :git
 
# master is our default git branch
set :branch, "master"
 
# Use local git repository
set :repository, "."
 
# Checkout, compress and send a local copy
set :deploy_via, :copy
set :deploy_to, "/home3/#{user}/rails_apps/#{application}"
 
# We have all components of the app on the same server
server domain, :app, :web, :db, :primary => true
 
namespace :deploy do
  task :start do ; end
  task :stop do ; end
 
  # Touch tmp/restart.txt to tell Phusion Passenger about new version
  task :restart, :roles => :app, :except => { :no_release => true } do
    run "touch #{File.join(current_path, 'tmp', 'restart.txt')}"
  end
end

# Clean-up old releases
after "deploy:restart", "deploy:cleanup"

#set :application, "set your application name here"
#set :repository,  "set your repository location here"

# set :scm, :git # You can set :scm explicitly or Capistrano will make an intelligent guess based on known version control directory names
# Or: `accurev`, `bzr`, `cvs`, `darcs`, `git`, `mercurial`, `perforce`, `subversion` or `none`

#role :web, "your web-server here"                          # Your HTTP server, Apache/etc
#role :app, "your app-server here"                          # This may be the same as your `Web` server
#role :db,  "your primary db-server here", :primary => true # This is where Rails migrations will run
#role :db,  "your slave db-server here"

# if you want to clean up old releases on each deploy uncomment this:
# after "deploy:restart", "deploy:cleanup"

# if you're still using the script/reaper helper you will need
# these http://github.com/rails/irs_process_scripts

# If you are using Passenger mod_rails uncomment this:
# namespace :deploy do
#   task :start do ; end
#   task :stop do ; end
#   task :restart, :roles => :app, :except => { :no_release => true } do
#     run "#{try_sudo} touch #{File.join(current_path,'tmp','restart.txt')}"
#   end
# end