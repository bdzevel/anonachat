var Primus = require("../lib/primus/primus");
var EventEmitter = require("events").EventEmitter;
var Message = require("../../services/command/message");
var constants = require("../../resources/constants").Chat;

class ChatStore extends EventEmitter
{
	constructor()
	{
		this.dispatcher = require("../dispatcher/dispatcher");
		this.dispatcher.register(onAction);
		
		this.webSocket = Primus.connect("ws://" + window.location.hostname + ":" + window.location.port);
		this.webSocket.on("data", onData);
	}
	
	writeMessage(message)
	{
		this.webSocket.write({ Message: message });
	}
	
	connect()
	{
		let msg = new Message(constants.Actions.Connect);
		this.writeMessage(msg);
	}
	
	disconnect()
	{
		let msg = new Message(constants.Actions.Disconnect);
		this.writeMessage(msg);
	}
	
	postChatMessage(message)
	{
		let msg = new Message(constants.Actions.PostMessage);
		msg.addArgument("Message", message);
		this.writeMessage(msg);
	}
	
	addConnectListener(callback)
	{
		this.on(constants.Actions.Connect, callback);
	}
	removeConnectListener(callback)
	{
		this.removeListener(constants.Actions.Connect, callback);
	}
	
	addDisconnectListener(callback)
	{
		this.on(constants.Actions.Disconnect, callback);
	}
	removeDisconnectListener(callback)
	{
		this.removeListener(constants.Actions.Disconnect, callback);
	}
	
	addPostMessageListener(callback)
	{
		this.on(constants.Actions.PostMessage, callback);
	}
	removePostMessageListener(callback)
	{
		this.removeListener(constants.Actions.PostMessage, callback);
	}
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
	if (action.Type == constants.Chat.Actions.Connect)
	{
		store.connect();
	}
	else if (action.Type == constants.Chat.Actions.Disconnect)
	{
		store.disconnect();
	}
	else if (action.Type == constants.Chat.Actions.PostMessage)
	{
		store.postChatMessage(action.Payload);
	}
}

module.exports = store;