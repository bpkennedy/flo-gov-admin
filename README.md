This guide was created by J Cole Morrison, and he keeps it updated [here](http://start.jcolemorrison.com/building-an-angular-and-express-app-part-1/).  The below steps have already been performed in this repo's code and you can clone this down into a new project if you wish.

## Getting the Tools

First make sure you have Node.js installed. They have a nice package installer for all systems.

**update 2/5/2017 - I'm currently using NVM to manage my versions of Node and version 6.9.5 with this tutorial**

Go to your command line (that should be using bash, so Mac OSX on terminal and Windows on... Powershell?). Do the following:
```
$ npm install -g express
```
**if you have trouble installing, try as your root user ala `sudo`**

Express is a low level server framework.
```
$ npm install -g express-generator
```
This is going to help us scaffold out the server side of things. Don't worry, it's made by the actual express people.
```
$ npm install -g yo
```
**shortcut is `npm i -g yo`**

Yeoman is a beastly beast. It's going to make life much easier by putting front end files in the right place and optimize our distribution versions.

Now that we're used to it, we're going to go ahead and batch install an number of things instead of installing them one at a time.
```
$ npm install -g grunt-cli bower generator-karma generator-angular
```
Each of what we just installed are:

a) The Grunt CLI - the task runner which will be in charge of building our files down for both development AND production. As it's name implies, it's the command line interface for Grunt. Yeoman heavily uses this in the background.

b) Bower - is like npm for our front-end assets. Well except this is far more dependable than npm. Although in modern day JS development I by far prefer Yarn.

c) Generator Karma - This scaffolds out a testing environment using the Karma Test Runner

d) Generator Angular - is a partner that works with Yeoman. Don't worry both Yeoman and Generator Angular are built, supported, and maintained by some REALLY talented folks at Google. So you won't have to worry about it being unsupported anytime soon.

**Update 2/5/2017: Okay, it's still heavily used an bug maintained now days. But it serves it's purpose**

And let's do one more install -
```
$ npm install -g nodemon
```
Nodemon is an awesome package that will keep our node server from having to be restarted each time we change the server side code. Years later, it still amazes me how simple and powerful this tool is.

## Scaffolding Time!

**1) On your command line, navigate to where you want this to happen, and create a directory called projectName**
```
$ mkdir projectName && cd projectName
```
The above, `projectName`, is obviously just an example, go to/make whatever you want.

2) Make the root project directory and two sub directories `client` and `server` to start. Also `cd` into the new `client` directory.
```
$ mkdir server && mkdir client && cd client/
```
**3) In the client do:**
```
$ yo angular
```
At this point you'll be asked a variety of different options. Let's go with the following:

**a) Would you like to use Gulp (experimental) instead of Grunt?** N

because looking at issues surrounding usage, Gulp doesn't seem well integrated with the generator.

**b) Would you like to use Sass (with Compass)?** N

I'm more of a LESS guy, so let's set that up on our own via grunt later.

**c) Would you like to include Bootstrap?** N

Let's not use bootstrap for this example.

**d) Which modules would you like to include?**

Select all of the options here. Just so that they're available later on if we need them. Make sure all the little dots next to them are green. At this point, NPM will do it's vomit of code.

**Note: If you run into problems here try doing `npm cache clean` and a `bower cache clean`. If you're using these regularly, the two managers will try and cache old packages and mess up.**

If the install stops and just shows execution time - press `enter` and it will continue on. What's happened is that an initial `package.json` file is created, and when Yeoman goes to scaffold out, the two conflict - and yeoman asks if we'd be okay with overwriting it. However instead of waiting for our input, it just goes ahead and continues installing things.

Great.

Before we leave install land, let's fix one thing that's required in 2017:

**b)** Open up `package.json`

**b)** find the `devDependency` called `"grunt-contrib-cssmin"` and change it to reflect:

`"grunt-contrib-cssmin": "^1.0.2",`

This is necessary to get it to play nicely with Node > 6.0.0

Also, add another `devDependency` right below it (or anywhere in `devDependencies`):

`"grunt-connect-proxy": "^0.2.0"`

This is what we're going to use in order to proxy API requests to our Express server.

Now run `npm i` one more time, and we're good to go.

**5) Now test that it's working by running:**
```
$ grunt serve
```
This will result in a nice pretty webpage popping up at `localhost:9000`. After you've confirmed it's up, press `ctrl+c` to stop the server.

Yeoman, with all of its greatness, just set you up an awesome front end work flow and file structure. It's hard to understand just how powerfully cool it is right now, but once you start using it...it'll be REALLY hard to stop.

**Update 2/5/2017: I still think this is true in context of the Angular world. Obviously Webpack is running the React Empire now days.**



## Setting up the Front End Workflow

We have add Font Awesome and swap out glyphicons

**1) In our `client` directory, open `app/index.html` file paste the following right at the end of the `<head>` tag:**
```
<!-- endbuild -->  
<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">
```
While we're here let' do a bit of clean up as well that we'll need later.

**2) Right below the link tag we just added, insert the following:**
```
<base href="/" />
```
This will be used to allow us to turn on `html5mode` in Angular so that we can navigate without `#!` in all of our links.

Also, find the navigation bar in this file, which starts around line `41` and remove all the hash tags. So our navigation should look like:
```
<div class="container">  
  <div class="navbar-header">

    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#js-navbar-collapse">
      <span class="sr-only">Toggle navigation</span>
      <span class="icon-bar"></span>
      <span class="icon-bar"></span>
      <span class="icon-bar"></span>
    </button>
    <!-- we removed the hash -->
    <a class="navbar-brand" href="/">client</a>
  </div>

  <div class="collapse navbar-collapse" id="js-navbar-collapse">
    <!-- remove all the hashes -->
    <ul class="nav navbar-nav">
      <li class="active"><a href="/">Home</a></li>
      <li><a ng-href="/about">About</a></li>
      <li><a ng-href="/">Contact</a></li>
    </ul>
  </div>
</div>
```
Now let's turn on `html5mode`.

**3) In our `client` directory, open up `app/scripts/app.js` and modify it to reflect the following:**
```
'use strict';

/**
 * @ngdoc overview
 * @name clientApp
 * @description
 * # clientApp
 *
 * Main module of the application.
 */
angular  
  .module('clientApp', [
    'ngAnimate',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true); // <-- ADD THIS
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
  ```
This will allow us to escape the bane of hashtags and have proper looking inks.

Once you've done that, make sure that you're `grunt server` is still up via grunt serve and navigate to `localhost:9000`. Even if you've got it up still, navigate to it again to remove the hash.

Now let's actually swap out `glyphicons` for Font Awesome.

**4) In our `client` directory, navigate to `app/index.html`**

Modify our `footer` around line `56` to reflect the following:
```
<div class="footer">  
  <div class="container">
    <p><i class="fa fa-heart"></i> from the Yeoman team</p>
  </div>
</div>
```  
Next, still in our `client` directory, navigate to `app/views/main.html` and change the main `Splended!` button to reflect the following:
```
<div class="jumbotron">  
  <h1>'Allo, 'Allo!</h1>
  <p class="lead">
    <img src="images/yeoman.png" alt="I'm Yeoman"><br>
    Always a pleasure scaffolding your apps.
  </p>
  <!-- Right here, this guy. Note the removed Hash as well. -->
  <p><a class="btn btn-lg btn-success" ng-href="/">Splendid! <i class="fa fa-check"></i></a></p>
</div>  
```
Now on to the backend. Leave the command shell tab currently running grunt alive and open up a new tab.

## Scaffold Out the Back End

**Update 2/5/2017: Instead of making this watch our grunt project all messy like, we're instead going to proxy API requests to it in development but when we build it for production, still package it all here**

Now we're going to setup Express JS. They team that created Express also made a nice little generator (you installed it earlier with `npm install -g express-generator`) that scaffolds a basic backend up. We're going to use that and then delete what we don't need vs. coding everything ground up. I find it faster and fewer keystrokes to do it this way (and I don't have to worry about forgetting some random setting).

The summary of these changes is that it makes it so we serve the Angular app by default and let it handle routing, IN PRODUCTION. We do this by leveraging Express' "static" directory ability. The `production` mode will serve from our `server/dist/` folder which is where Yeoman will put our optimized app when we tell it to build.

When in development, we'll setup our client application to send requests to the server and use it like an `API`. This is what it should be anyway.

The beauty of this setup is that it will allow us to leverage express as a RESTful service. It will also makes it so that our `server` folder is the only thing we worry about deploying.

**1) If you haven't already, open up a new command shell tab in the `server` directory we created**

Run:
```
$ express
```

Some npm vomit will happen. When it's completed, run:

```
$ npm i
```
This will put all dependencies that we need in our `server` directory.

**again, if you're getting old deps, just do an `npm cache clean`**

**2) In our `server` directory, open up our `app.js` file and modify it around line `25` to reflect the following:**
```
// app.use('/', index); <-- COMMENT THIS
app.use('/api/users', users); // <-- note we're calling this API

// In production, we'll actually serve our angular app from express
if (app.get('env') === 'production') {  
  app.use(express.static(path.join(__dirname, '/dist')));

  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });
}
```
Don't forget to comment out that index line.

What this is doing is that if we have `NODE_ENV=production`, our express application will look for a `dist` directory. This `dist` directory is where we'll build down our Angular application with grunt when we're ready to deploy it.

One more thing in `app.js`, we need to deal with `CORS`. Thankfully there's a very simple express middleware for that.

**3) In our `server` commandshell tab run the following:**
```
$ npm i cors --save
```
In our `server/app.js` file, right after, body parser, add `CORS` and then right after we define our `app` use the `cors()` middleware:
```
// ...
var bodyParser = require('body-parser');  
var cors = require('cors')

var index = require('./routes/index');  
var users = require('./routes/users');

var app = express();

app.use(cors()) // <--- CORS  
// ...
```
This is going to allow our server to act as true API server. That means that it will allow it to serve data to any client that requests it. Without it, only requests from the origin would be allowed to access our api.

Save the file.

**4) In our `server` directory, navigate to `/routes/users.js`**

Inside of here, modify the file to reflect the following:
```
var express = require('express');  
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {  
  res.json({
    users: [
      {_id: 1, email: 'test.a@angular.com'},
      {_id: 2, email: 'test.b@grunt.com'},
      {_id: 3, email: 'test.b@express.com'}
    ]
  })
});

module.exports = router;
```  
This will make it so that our `users` endpoint is now an API endpoint and serve `Json`.

**5) In our `server` directory, navigate to `package.json`**

Here, let's add a script:
```
"scripts": {
  "start": "NODE_ENV=production node ./bin/www",
  "dev": "nodemon ./bin/www"
},
```
If you intend to have `nodemon` available on your production server environment, you can swap out `start`'s `node` with `nodemon`.

Now we can fire up our server by running:
```
$ npm run dev
```
Once run, navigate to `localhost:3000/api/users` and we'll see our `json` returned in the browser!



## Connecting the Backend and Frontend for Development

This will get a bit tedius, but is well worth it in my opinion. What we'll be setting up will result in the following:

**1)** Our `server` is listening on `localhost:3000`

Any new `json` style data we wish to server should be namespaced with `/api`

**2)** Our development `client` is listening on `localhost:9000`, we've already seen that

**3)** Any requests on our `client` to a `/api` endpoint will be "proxied" to `localhost:3000/api` which is our `server`.

**4)** Any requests NOT to `/api` on our `client` will just be handled by our `localhost:9000` `client`.

What's the point of this:

**a)** It keeps us from having to do this hacky process where we have Express watch our `.tmp` folder inside of our `client` directory.

**b)** It keeps us from having to resfresh the page everytime we update the code and still leverage live reload

**c)** It allows so that when we build down our code, we don't have to change any of the API urls.

Now this is going to get a little hairy with `Grunt`. And I'll give a rough outline, but it really is it's own beast that would require far more space than this guide has to give..

**1) In our `client` directory, open up our `Gruntfile.js`**

**2) Around line `19` grunt loads in a number of modules. We need to add the `proxy` service module we installed here.**

Modify that block of code to be:
```
require('jit-grunt')(grunt, {  
  useminPrepare: 'grunt-usemin',
  ngtemplates: 'grunt-angular-templates',
  cdnify: 'grunt-google-cdn',
  configureProxies: 'grunt-connect-proxy' // <-- ADD HERE
});
```
**3) Still in our `Gruntfile.js`, around line `23`, our app build options are defined. Let's change that to the following:**
```
// Configurable paths for the application
var appConfig = {  
  app: require('./bower.json').appPath || 'app',
  dist: '../server/dist' // <-- MODIFY
};
```
When we run a the command `grunt build`, our app will compile a minified, optimized version of our application and put it into our `server` folder's `dist` directory (which it will create for us if it doesn't exist).

**3) In our `Gruntfile.js`, around line `72`, our dev server options are defined. Let's change that to the following:**
```
// The actual grunt server settings
connect: {  
  options: {
    port: 9000,
    // Change this to '0.0.0.0' to access the server from outside.
    hostname: 'localhost',
    livereload: 35729
  },
  proxies: [ // <-- ADD
    {
      context: '/api',
      host: 'localhost',
      port: 3000
    }
  ],
  // ...
}
```
This does what we described at the beginning. If it's to the context of `/api` anywhere in our client application code, our grunt webserver will PROXY it to our `express` server!

**4) STILL in our `Gruntfile.js`, right below where we added `proxies`, so now around line `86`, we need to tell Livereload about our proxy**

Modify that block to be the following:
```
{
  // ...
  livereload: {
    options: {
      open: true,
      middleware: function (connect) {
        return [
          require('grunt-connect-proxy/lib/utils').proxyRequest, // <-- HERE
          connect.static('.tmp'),
          connect().use(
            '/bower_components',
            connect.static('./bower_components')
          ),
          connect().use(
            '/app/styles',
            connect.static('./app/styles')
          ),
          connect.static(appConfig.app)
        ];
      }
    }
  },
  //...
}
```
Okay, alllllll most done.

**5) Around line `168`, yes still in our `Gruntfile`, we need to modify our clean task to be:**
```
// Empties folders to start fresh
clean: {  
  dist: {
    files: [{
      dot: true,
      src: [
        '.tmp',
        '<%= yeoman.dist %>/{,*/}*',
        '!<%= yeoman.dist %>/.git{,*/}*'
      ]
    }]
  },
  options: { // <-- ADD THIS
    force: true
  },
  server: '.tmp'
},
```
This is going to make it so that when we build down multiple `dist` directories into our `server` folder, we'll be able to overwrite the existing one.

**6) FINALLY, near the very bottom where we define our `grunt serve` task, we need to add our `configureProxies` service. Modify that block (around line `475`) to be:**
```
grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {  
  if (target === 'dist') {
    return grunt.task.run(['build', 'connect:dist:keepalive']);
  }

  grunt.task.run([
    'clean:server',
    'wiredep',
    'concurrent:server',
    'configureProxies', //<-- ADD THIS
    'postcss:server',
    'connect:livereload',
    'watch'
  ]);
});
```
This will make it so that when we run `grunt serve` our proxy service will actually begin.

PHEW.

**6) Restart our Grunt server**

If you still have this running in your command shell tag, `ctrl+c` it to stop the process. Run `grunt serve` again to boot it back up with the proxy in mind.

Now our Angular client development server will be up and ready to play with our Express API.

Let's confirm this.

**7) In our `client` directory, open up `app/scripts/controllers/main.js`**

Modify it to be:
```
'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')  
  .controller('MainCtrl', ['$http', function ($http) {
    var req = $http.get('/api/users');
    var scope = this;
    // arrow functions would be nice here
    // but this tutorial is already really long
    // so let's not mess with modifying grunt linting
    req.then(function (res) {
      scope.awesomeUsers = res.data.users;
    });
    req.catch(function (err) {
      console.log(err);
    });
    scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }]);
  ```
As we can see, we're calling to our `/api/users` end point which will hit our express server from Angular. We're then binding the user payload to our scope (`this` in 2017 eh).

**8) Still in our `client` directory, open up `/app/views/main.html` and around line `9` let's add a row that displays our users:**
```
<div class="row users">  
  <ul>
    <li ng-repeat="user in main.awesomeUsers track by user._id">
      {{user.email}}
    </li>
  </ul>
</div>
```  
AWESOME. Now our users we defined in our payload are indeed being sent down.

## Building down our Application

Now that we've got our development environment down par, what if we want to deploy? Well for purposes of this app, we're going to make it so that our `server` folder becomes our end product. We've actually already set EVERYTHING up to do this.

**1) In our `client` commandshell tab, shut down the grunt server and run `grunt build`**

This will build down a new file into our `server` called `dist`.

**2) Shutdown our express server in your server commandshell tab**

AFter doing so run the following:
```
$ npm start
```
as opposed to `npm run dev`.

Open up your browser to `localhost:3000`

AND THERE'S OUR ANGULAR EXPRESS APP!!!

If you wanted to deploy this, the `server` folder is all that you'd need.
