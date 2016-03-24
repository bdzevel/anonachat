var Content = require("./content.jsx");
var ChatForm = require("./chat-form.jsx");

var AnonachatAppSpec =
{
	render: function()
	{
		return (
			<div className="anonachat-app">
				<Content />
				<ChatForm />
			</div>
		);
	}
};

var React = require('react');
var AnonachatApp = React.createClass(AnonachatAppSpec);
module.exports = AnonachatApp;