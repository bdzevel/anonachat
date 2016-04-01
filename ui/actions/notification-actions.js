var constants = require("../../resources/constants.js").Notification;
var Dispatcher = require("../dispatcher/dispatcher.js");

var actions =
{
	SendNotification: function(message)
	{
		Dispatcher.dispatch({ Type: constants.Actions.Send, Payload: message });
	},

	ToggleNotifications: function(bool)
	{
		Dispatcher.dispatch({ Type: constants.Actions.Toggle, Payload: bool });
	}
};
module.exports = actions;