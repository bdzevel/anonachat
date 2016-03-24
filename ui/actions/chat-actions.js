var constants = require("../../resources/constants.js").Chat;
var Dispatcher = require("../dispatcher/dispatcher.js");

var actions =
{
	Connect: function()
	{
		Dispatcher.dispatch({ Type: constants.Commands.Connect });
	},

	Disconnect: function()
	{
		Dispatcher.dispatch({ Type: constants.Commands.Disconnect });
	},

	PostMessage: function(message)
	{
		Dispatcher.dispatch({ Type: constants.Commands.PostMessage, Payload: message });
	}
};
module.exports = actions;