var NavBar = require("./navbar.jsx");
var Content = require("./content.jsx");

var AnonachatAppSpec =
{
	render: function()
	{
		return (
			<div className="container-fluid anonachat-app">
				<NavBar />
				<Content />
			</div>
		);
	}
};

var React = require('react');
var AnonachatApp = React.createClass(AnonachatAppSpec);
module.exports = AnonachatApp;