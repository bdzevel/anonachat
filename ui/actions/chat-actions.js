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
	},

	JoinRoom: function(roomName)
	{
		Dispatcher.dispatch({ Type: constants.Actions.JoinChatRoom, Payload: roomName });
	},

	LeaveRoom: function(roomName)
	{
		Dispatcher.dispatch({ Type: constants.Actions.LeaveChatRoom, Payload: roomName });
	}
};
module.exports = actions;