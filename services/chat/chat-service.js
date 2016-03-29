let TS = require("../../diagnostics/trace-sources").Get("Chat-Service");

let constants = require("../../resources/constants").Chat;

let ChatRoom = require("./chat-room");
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
		this.chatRooms = [ ];
		this.allClients = [ ];
		this.commandService = require("../command/command-service");
		this.commandService.register(constants.Actions.PostMessage, this, this.postMessage);
		this.commandService.register(constants.Actions.Connect, this, this.registerConnection);
		this.commandService.register(constants.Actions.Disconnect, this, this.deregisterConnection);
		this.commandService.register(constants.Actions.JoinChatRoom, this, this.joinChatRoom);
		this.commandService.register(constants.Actions.LeaveChatRoom, this, this.leaveChatRoom);
	}
	
	findClient(id)
	{
		let client = this.allClients.find(function(client) { return client.ClientID === id; });
		return client;
	}
	
	findRoomByName(name)
	{
		let room = this.chatRooms.find(function(room) { return room.RoomName === name; });
		return room;
	}
	
	registerConnection(message, context)
	{
		let newUserName = this.generateUnusedUserName();
		context.setUserName(newUserName);
		this.allClients.push(context);
		
		let roomName = this.getRoomName(message);
		let room = this.ensureRoom(roomName);
		room.connect(context);
		
		let response = new Message(constants.Actions.ConnectResponse);
		response.addParameter("Client", context);
		response.addParameter("ConnectedClients", room.ConnectedClients);
		return response;
	}
	
	generateUnusedUserName()
	{
		let adjectives = require("../../words/adjectives");
		let nouns = require("../../words/animals");
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
	
	getRoomName(message)
	{
		let room = message.getParameter("Room");
		if (!room)
			return "global";
		return room.toLowerCase();
	}
	
	ensureRoom(roomName)
	{
		let room = this.findRoomByName(roomName);
		if (!room)
		{
			room = new ChatRoom(roomName);
			this.chatRooms.push(room);
		}
		return room;
	}
	
	postMessage(message, context)
	{
		let roomName = this.getRoomName(message);
		let room = this.findRoomByName(roomName);
		if (!room)
			return;
		let messageStr = message.getParameter("Message");
		room.postMessage(messageStr, context);
		return new Message(constants.Actions.PostMessageResponse);
	}
	
	deregisterConnection(message, context)
	{
		let index = -1;
		this.allClients.find(function(c, i) { if (c.ClientID === context.ClientID) index = i; return c.ClientID === context.ClientID; });
		if (index === -1)
			return null;
		this.allClients.splice(index, 1);
		this.freeUserName(context.UserName);
		this.chatRooms.forEach(function(r) { r.disconnect(context); });
		return null;
	}
	
	freeUserName(name)
	{
		let userNames = require("./user-names");
		let i = -1;
		let userName = userNames.find(function(userName, index) { if (userName === name) i = index; return userName === name; });
		if (i === -1)
			return;
		userNames.splice(i, 1);
	}
	
	joinChatRoom(message, context)
	{
		let roomName = this.getRoomName(message);
		let room = this.ensureRoom(roomName);
		room.connect(context);
		let response = new Message(constants.Actions.JoinChatRoomResponse);
		response.addParameter("ConnectedClients", room.ConnectedClients);
		return response;
	}
	
	leaveChatRoom(message, context)
	{
		let roomName = this.getRoomName(message);
		let room = this.findRoomByName(roomName);
		if (!room)
			return;
		room.disconnect(context);
		return new Message(constants.Actions.LeaveChatRoomResponse);
	}
}

module.exports = new ChatService();