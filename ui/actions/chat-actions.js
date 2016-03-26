var constants = require("../../resources/constants.js").Chat;
var Dispatcher = require("../dispatcher/dispatcher.js");

var actions =
{
	Connect: function()
	{
		Dispatcher.dispatch({ Type: constants.Actions.Connect });
	},

	Disconnect: function()
	{
		Dispatcher.dispatch({ Type: constants.Actions.Disconnect });
	},

	PostMessage: function(message)
	{
		Dispatcher.dispatch({ Type: constants.Actions.PostMessage, Payload: message });
	}
};
module.exports = actions;