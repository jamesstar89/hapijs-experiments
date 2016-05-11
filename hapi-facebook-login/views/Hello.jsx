// Default layout template
var React = require('react');

var Hello = React.createClass({

  render: function() {

  	var showLogin = {'display':'none'}
  	var showLogout = {'display':'none'}

  	if(!this.props.isAuth) {
  		showLogin = {'display':'block'}
  	} else {
  		showLogout = {'display':'block'}
  	}

    return(
		<html>
		<head>
			<title>Hello page</title>
		</head>
		<body>
			<div>
				<span style={showLogin}>
					<a href='/login'>Sign in with Facebook</a>
				</span>
				<span style={showLogout}>
					<a href='/logout'>Logout</a>
				</span>
			</div>
			<div>
				<h1>
					Hello <span className='person'></span>
				</h1>
			</div>
			<script src='js/app.min.js'></script>
		</body>
		</html>
    );
  }

});

module.exports = Hello;