'use strict';

require('babel-register')({
  presets: ['es2015', 'react'],
});

const creds = require('./env');

console.log("Creds: ", creds);

const Hapi = require('hapi');

// Create a server
const server = new Hapi.Server();

server.connection({
  host: 'localhost',
  port: '8000', 
  routes: {
    cors: true
  }
});

var isAuthenticated = false;

var facebookData = {};

// Add to store later
var Person = {};

// Base Person Object
Person = {
  'name' : 'Samara',
  'file' : 'samara.jpg',
  'comment' : 'Simple post about Samara',
  'tags' : ['year-one'],
  'date' : '',
  'event' : {
    'name' : 'Park',
    'location' : '',
    'comment' : 'Samara at the park'
  },
  'data' : ['one-drive'],
  'share' : [
      {
        'name' : 'facebook',
        'shares' : 2,
        'auth' : 'yes'
      },
      {
        'name' : 'twitter',
        'tweets' : 0,
        're-tweets' : 0,
        'auth' : 'yes'
      }
    ]
}

server.register([{
  register: require('inert')
    },{
  register: require('vision')
    },{
  register: require('bell')
    },{
  register: require('hapi-auth-cookie')
  }], function(err) {

    if (err) return console.error(err);

    // Add the React-rendering view engine
    server.views({
        engines: {
            jsx: require('hapi-react-views')
        },
        relativeTo: __dirname,
        path: 'views'
    });

    server.auth.strategy('session', 'cookie', {  
        cookie: 'facebook-auth',
        password: 'cookie_encryption_password_secure',
        isSecure: false,
        redirectTo: false
    });

    server.auth.strategy('facebook', 'bell', {
        provider: 'facebook',
        password: 'cookie_encryption_password_secure',
        isSecure: false,
        // You'll need to go to https://developers.facebook.com/ and set up a
        // Website application to get started
        // Once you create your app, fill out Settings and set the App Domains
        // Under Settings >> Advanced, set the Valid OAuth redirect URIs to include http://<yourdomain.com>/bell/door
        // and enable Client OAuth Login
        clientId: creds.CLIENT_ID,
        clientSecret: creds.CLIENT_SECRET,
        location: server.info.uri
    });

    server.auth.default('session');

    // Add the route
    server.route(
      [{
          method: 'GET',
          path: '/{param*}',
          config: {
            auth: false,
            handler: {
              directory: {
                path: 'assets',
                index: ['index.html']
              }
            }
          }
      },{
          method: ['GET'],
          path: '/login',
          config: {
            auth: 'facebook',
            handler: function (request, reply) {
                if (request.auth.isAuthenticated) {
                    var credentials = request.auth.credentials;
                    isAuthenticated = true;
                    facebookData = credentials;
                    request.cookieAuth.set(credentials);
                    reply.redirect("/");
                }
            }
          }
      },{  
          method: 'GET',
          path: '/logout',
          config: {
              auth: 'session',
              handler: function (request, reply) {
                var token = facebookData.token;
                var logoutUrl = 'https://www.facebook.com/logout.php?next=http://localhost:8000&access_token=' + token;
                isAuthenticated = false;
                facebookData = {};
                request.cookieAuth.clear();
                reply.redirect(logoutUrl);      
              }
          }
      },{
          method: 'GET',
          path:'/', 
          config: {
            auth: {
              mode: 'optional'
            },
            handler: function (request, reply) {
              reply.view('Hello', {'isAuth' : isAuthenticated})
            }
          }
      },{
          method: 'GET',
          path:'/hello',
          config: {
            auth: {
              mode: 'optional'
            },
            handler: function (request, reply) {
                var sendObj = {
                  'person': Person.name
                }
                if(isAuthenticated) {
                  sendObj.person = facebookData.profile.name.first;
                }
                reply(sendObj);

            }
          }
      }]);

    // Start the server
    server.start((err) => {
        if (err) {
            throw err;
        }
        console.log('Server running at:', server.info.uri);
    });

});