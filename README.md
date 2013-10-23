## Deployment Process

From the local project run:  
    $ cap deploy  
  
Login to Blue Host using:
    $ ssh bairdcon@bairdconklinmusic.com

From the ssh commandline on Blue Host run the following:  
    $ cd rails_apps/conklinbairdmusic/current
    $ bundle install
    $ bundle exec rake db:migrate
    $ bundle exec rake assets:precompile
