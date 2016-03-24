"use strict";

let TS = require("../../diagnostics/trace-sources").Get("Chat-Service");

let constants = require("../../resources/constants").Chat;

let Message = require("../command/message");

class ChatService
{
	constructor()
	{
		TS.TraceVerbose(__filename, "Initializing Chat Service...");
		this.initialize();
		TS.TraceVerbose(__filename, "Finished initializing Chat Service");
	}
	
	initialize()
	{
		this.connectedClients = [ ];
		this.commandService = require("../command/command-service");
		this.commandService.register(constants.Actions.PostMessage, this, this.postMessage);
		this.commandService.register(constants.Actions.Connect, this, this.registerConnection);
		this.commandService.register(constants.Actions.Disconnect, this, this.deregisterConnection);
	}
	
	findClient(id)
	{
		let client = this.connectedClients.find(function(client) { return client.ClientID === clientID; });
		return client;
	}
	
	registerConnection(message, context)
	{
		context.setUserName(this.generateUnusedUserName());
		this.connectedClients.push(context);
		this.notifyNewConnection(context);
		var response = new Message(constants.Actions.ConnectResponse);
		response.addParameter("ConnectedClients", this.connectedClients);
		return response;
	}
	
	notifyNewConnection(context)
	{
		let message = new Message(constants.Actions.Connect);
		message.addParameter("Client", context);
		this.connectedClients.forEach(function(client) { client.write({ Message: message }) });
	}
	
	postMessage(message, context)
	{
		let msg = new Message(constants.Actions.PostMessage);
		msg.addParameter("Message", message.getParameter("Message"));
		msg.addParameter("Client", context);
		msg.addParameter("DateTime", Date.now());
		this.connectedClients.forEach(function(client) { client.write({ Message: msg }); });
		return new Message(constants.Actions.PostMessageResponse);
	}
	
	deregisterConnection(message, context)
	{
		this.connectedClients.remove(context);
		this.freeUserName(context.UserName);
		this.notifyDisconnection();
		return null;
	}
	
	notifyDisconnection(context)
	{
		let msg = new Message(constants.Actions.Disconnect);
		msg.addParameter("Client", context);
		this.connectedClients.forEach(function(client) { client.write({ Message: msg }) });
	}
	
	generateUnusedUserName()
	{
		let adjectives = require("../../words/adjectives");
		let nouns = require("../../words/nouns");
		let userNames = require("./user-names");
		let userName = "";
		do
		{
			let adj = adjectives.GetRandomWord();
			let noun = nouns.GetRandomWord();
			userName = adj + " " + noun;
		} while (userNames.find(function(name) { return name === userName; }));
		userNames.push(userName);
		return userName;
	}
	
	freeUserName(name)
	{
		let userNames = require("./user-names");
		let userName = userNames.find(function(n) { return n === name; });
		if (userName)
			userNames.remove(userName);
	}
}

module.exports = new ChatService();