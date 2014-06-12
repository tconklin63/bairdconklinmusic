### Deployment Process

From the local project run:

```
$ cap deploy

$ cap deploy:migrate
```

Login to Blue Host using:

```
$ ssh bairdcon@bairdconklinmusic.com
```

From the ssh commandline on Blue Host run the following:

```
$ cd rails_apps/bairdcoinklinmusic/current

$ bundle install

$ bundle exec rake db:migrate RAILS_ENV=production

$ bundle exec rake assets:precompile RAILS_ENV=production
```


