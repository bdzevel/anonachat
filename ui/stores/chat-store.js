var Primus = require("../lib/primus/primus");
var EventEmitter = require("events").EventEmitter;
var Message = require("../../services/command/message.js");
var constants = require("../../resources/constants.js").Chat;

function ChatStore()
{
	this.dispatcher = require("../dispatcher/dispatcher.js");
	this.dispatcher.register(onAction);
	
	this.webSocket = Primus.connect("ws://" + window.location.hostname + ":" + window.location.port);
	this.webSocket.on("data", onData);
}
ChatStore.prototype = new EventEmitter();

ChatStore.prototype.writeMessage = function(message)
{
	this.webSocket.write({ Message: message });
}

ChatStore.prototype.connect = function()
{
	let msg = new Message(constants.Actions.Connect);
	this.writeMessage(msg);
}

ChatStore.prototype.disconnect = function()
{
	let msg = new Message(constants.Actions.Disconnect);
	this.writeMessage(msg);
}

ChatStore.prototype.postChatMessage = function(message)
{
	let msg = new Message(constants.Actions.PostMessage);
	msg.addParameter("Message", message);
	this.writeMessage(msg);
}

ChatStore.prototype.joinRoom = function(name)
{
	let msg = new Message(constants.Actions.JoinChatRoom);
	msg.addParameter("Room", name);
	this.writeMessage(msg);
}

ChatStore.prototype.leaveRoom = function(name)
{
	let msg = new Message(constants.Actions.LeaveChatRoom);
	msg.addParameter("Room", name);
	this.writeMessage(msg);
}

ChatStore.prototype.addConnectListener = function(callback)
{
	this.on(constants.Actions.Connect, callback);
}
ChatStore.prototype.removeConnectListener = function(callback)
{
	this.removeListener(constants.Actions.Connect, callback);
}

ChatStore.prototype.addRoomChangeListener = function(callback)
{
	this.on(constants.Actions.JoinChatRoomResponse, callback);
}
ChatStore.prototype.removeRoomChangeListener = function(callback)
{
	this.removeListener(constants.Actions.JoinChatRoomResponse, callback);
}

ChatStore.prototype.addConnectResponseListener = function(callback)
{
	this.on(constants.Actions.ConnectResponse, callback);
}
ChatStore.prototype.removeConnectResponseListener = function(callback)
{
	this.removeListener(constants.Actions.ConnectResponse, callback);
}

ChatStore.prototype.addDisconnectListener = function(callback)
{
	this.on(constants.Actions.Disconnect, callback);
}
ChatStore.prototype.removeDisconnectListener = function(callback)
{
	this.removeListener(constants.Actions.Disconnect, callback);
}

ChatStore.prototype.addPostMessageListener = function(callback)
{
	this.on(constants.Actions.PostMessage, callback);
}
ChatStore.prototype.removePostMessageListener = function(callback)
{
	this.removeListener(constants.Actions.PostMessage, callback);
}

var store = new ChatStore();

function onData(data)
{
	if (!(data.Message))
	{
		console.error("Data received, but no Message found...");
		return;
	}
	var msg = Message.fromJson(data.Message);
	store.emit(msg.Symbol, msg);
}

function onAction(action)
{
	if (action.Type == constants.Actions.Connect)
	{
		store.connect();
	}
	else if (action.Type == constants.Actions.Disconnect)
	{
		store.disconnect();
	}
	else if (action.Type == constants.Actions.PostMessage)
	{
		store.postChatMessage(action.Payload);
	}
	else if (action.Type == constants.Actions.JoinChatRoom)
	{
		store.joinRoom(action.Payload);
	}
	else if (action.Type == constants.Actions.LeaveChatRoom)
	{
		store.leaveRoom(action.Payload);
	}
}

module.exports = store;