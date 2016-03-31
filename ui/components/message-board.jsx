var $ = require("jquery");
var Label = require("react-bootstrap").Label;

var ChatMessageList = require("./chat-message-list.jsx");
var ChatForm = require("./chat-form.jsx");

var chatStore = require("../stores/chat-store.js");

var MessageBoardSpec =
{
	onPostMessage: function(message)
	{
		let chatMessage = message.getParameter("Message");
		let clientInfo = message.getParameter("Client");
		let dateTime = new Date(message.getParameter("DateTime"));
		this.state.chatMessages.push({ DateTime: dateTime, User: clientInfo, Message: chatMessage });
		this.setState({ chatMessages: this.state.chatMessages });
		this.sendNotification(clientInfo, chatMessage);
		this.scrollToBottom();
	},
	
	sendNotification: function(client, message)
	{
		if (!this.notificationsAllowed || !document.hidden || this.state.me.ClientID === client.ClientID)
			return;
		let notification = new Notification(client.UserName + ": " + message);
	},
	
	scrollToBottom: function()
	{
		let list = $("#chat-message-list");
		list.scrollTop(list.prop("scrollHeight"));
	},
	
	onRoomChange: function(message)
	{
		let roomName = message.getParameter("Room");
		this.setState({ roomName: roomName, chatMessages: [ ] });
	},
	
	onUserConnect: function(message)
	{
		var client = message.getParameter("Client");
		this.state.chatMessages.push({ DateTime: new Date(Date.now()), Message: client.UserName + " joined..." });
		this.setState({ chatMessages: this.state.chatMessages });
	},

	onUserDisconnect: function(message)
	{
		var client = message.getParameter("Client");
		this.state.chatMessages.push({ DateTime: new Date(Date.now()), Message: client.UserName + " left..." });
		this.setState({ chatMessages: this.state.chatMessages });
	},
	
	onConnectResponse: function(message)
	{
		var client = message.getParameter("Client");
		this.setState({ me: client });
	},
	
	componentDidMount: function()
	{
		chatStore.addConnectListener(this.onUserConnect);
		chatStore.addDisconnectListener(this.onUserDisconnect);
		chatStore.addRoomChangeListener(this.onRoomChange);
		chatStore.addPostMessageListener(this.onPostMessage);
		chatStore.addConnectResponseListener(this.onConnectResponse);
		
		this.requestNotificationPermission();
	},
	
	requestNotificationPermission: function()
	{
		this.notificationsAllowed = false;
		var permission = Notification.permission;
		if (!("Notification" in window) || permission === "denied")
			return;
		if (permission === "granted")
		{
			this.notificationsAllowed = true;
		}
		else
		{
			Notification.requestPermission().then(function (p) { permission = p; });
			if (permission === "granted")
				this.notificationsAllowed = true;
		}
	},

	componentWillUnmount: function()
	{
		chatStore.removeConnectListener(this.onUserConnect);
		chatStore.removeDisconnectListener(this.onUserDisconnect);
		chatStore.removeRoomChangeListener(this.onRoomChange);
		chatStore.removePostMessageListener(this.onPostMessage);
		chatStore.removeConnectResponseListener(this.onConnectResponse);
	},

	getInitialState: function()
	{
		return { roomName: "global", chatMessages: [ ] };
	},

	render: function()
	{
		return (
			<div className="flexbox">
				<Label bsStyle="primary">Messages</Label>
				<ChatMessageList id="chat-message-list" className="scrollable"
					chatMessages={this.state.chatMessages}
					me={this.state.me} />
				<ChatForm className="footer" roomName={this.state.roomName} />
			</div>
		);
	}
};

var React = require("react");
var MessageBoard = React.createClass(MessageBoardSpec);
module.exports = MessageBoard;