'use strict';

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

// Add the route
server.route(
	[{
	    method: 'GET',
	    path:'/', 
	    handler: function (request, reply) {
	        return reply('Index page');
	    }
	},{
	    method: 'GET',
	    path:'/hello', 
	    handler: function (request, reply) {
          var sendObj = {
            'person': Person.name
          }
	        reply(sendObj);
	    }
	}]);

// Start the server
server.start((err) => {
    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});