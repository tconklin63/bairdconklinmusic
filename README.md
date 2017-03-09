### Baird-Conklin Music
This application is currently deployed to https://bairdconklinmusic.herokuapp.com. I have temporarily made this repository public to show code to prospective employers.

### Deployment Process

From the local project directory run:

```
$ git push heroku master
```

If database migrations are needed run:

```
$ heroku run rake db:migrate
```

