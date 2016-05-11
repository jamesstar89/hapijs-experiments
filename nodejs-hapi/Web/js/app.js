var React = require('react'),
	ReactDom = require('react-dom'),
	Router = require('react-router').Router,
	Porivder = require('react-redux').Provider;

// set up a basic route to /hello
function getHello() {
	fetch('http://localhost:8000/hello', {
  		method: 'get'
	})
	.then(function(resp) {
		return resp.json();
	})
	.then(function(data) {
		console.log(data);
		document.getElementsByClassName("person")[0].innerHTML = data.person;
	});
}

getHello();