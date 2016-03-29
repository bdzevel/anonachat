let constants = require("../../resources/constants").Chat;

let Message = require("../command/message");

class ChatRoom
{
	constructor(name)
	{
		this.RoomName = name;
		this.ConnectedClients = [ ];
	}
	
	findClient(id)
	{
		let client = this.ConnectedClients.find(function(client) { return client.ClientID === id; });
		return client;
	}
	
	connect(client)
	{
		this.notifyNewConnection(client);
		this.ConnectedClients.push(client);
	}
	
	notifyNewConnection(client)
	{
		let message = new Message(constants.Actions.Connect);
		message.addParameter("Client", client);
		this.ConnectedClients.forEach(function(c) { c.write({ Message: message }) });
	}
	
	postMessage(messageStr, context)
	{
		let msg = new Message(constants.Actions.PostMessage);
		msg.addParameter("Message", messageStr);
		msg.addParameter("Client", context);
		msg.addParameter("DateTime", Date.now());
		this.ConnectedClients.forEach(function(client) { client.write({ Message: msg }); });
	}
	
	disconnect(client)
	{
		let index = -1;
		let c = this.ConnectedClients.find(function(c, i) { if (c.ClientID === client.ClientID) index = i; return c.ClientID === client.ClientID; });
		if (index === -1)
			return null;
		this.ConnectedClients.splice(index, 1);
		this.notifyDisconnection(client);
	}
	
	notifyDisconnection(client)
	{
		let msg = new Message(constants.Actions.Disconnect);
		msg.addParameter("Client", client);
		this.ConnectedClients.forEach(function(c) { c.write({ Message: msg }) });
	}
}

module.exports = ChatRoom;