"use strict";

let TS = require("../../diagnostics/trace-sources").Get("Chat-Service");

let Command = require("../command/command");
let Response = require("../command/response");

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
		this.commandService.register("CONNECT", this, this.registerConnection);
		this.commandService.register("POST_MESSAGE", this, this.postMessage);
		this.commandService.register("DISCONNECT", this, this.deregisterConnection);
	}
	
	findClient(id)
	{
		let client = this.connectedClients.find(function(client) { return client.ClientID === clientID; });
		return client;
	}
	
	registerConnection(command, context)
	{
		context.setUserName(this.generateUnusedUserName());
		this.connectedClients.push(context);
		var response = new Response("CONNECT_RESPONSE");
		response.addArgument("ConnectedClients", this.connectedClients);
		return response;
	}
	
	postMessage(command, context)
	{
		let message = command.getArgument("Message");
		this.connectedClients.forEach(function(client) { client.write({ ClientID: context.ID, Message: message }); });
		return new Response("POST_MESSAGE_RESPONSE");
	}
	
	deregisterConnection(command, context)
	{
		this.connectedClients.remove(context);
		this.freeUserName(context.UserName);
		return null;
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