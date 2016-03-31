var Label = require("react-bootstrap").Label;
var ListGroup = require("react-bootstrap").ListGroup;
var ListGroupItem = require("react-bootstrap").ListGroupItem;

var chatStore = require("../stores/chat-store.js");

var UserListSpec =
{
	onUserConnect: function(message)
	{
		var client = message.getParameter("Client");
		if (this.findUser(client))
			return;
		this.state.users.push(client);
		this.setState({ users: this.state.users });
	},
	
	onConnectResponse: function(message)
	{
		var client = message.getParameter("Client");
		if (!this.findUser(client))
			this.state.users.push(client);
		var clients = message.getParameter("ConnectedClients");
		for (var i = 0; i < clients.length; i++) {
			var client = clients[i];
			if (this.findUser(client))
				continue;
			this.state.users.push(client);
		}
		this.setState({ me: client, users: this.state.users });
	},
	
	onRoomChange: function(message)
	{
		this.state.users = [ ];
		this.state.users.push(this.state.me);
		var clients = message.getParameter("ConnectedClients");
		for (var i = 0; i < clients.length; i++) {
			var client = clients[i];
			if (this.findUser(client))
				continue;
			this.state.users.push(client);
		}
		this.setState({ users: this.state.users });
	},
	
	findUser: function(user)
	{
		return this.state.users.find(function(u) { return u.ClientID === user.ClientID; });
	},

	onUserDisconnect: function(message)
	{
		var client = message.getParameter("Client");
		var index = -1;
		var user = this.state.users.find(function(u, i) { if (u.ClientID === client.ClientID) index = i; return u.ClientID === client.ClientID; });
		if (index === -1)
			return;
		this.state.users.splice(index, 1);
		this.setState({ users: this.state.users });
	},

	componentDidMount: function()
	{
		chatStore.addConnectListener(this.onUserConnect);
		chatStore.addDisconnectListener(this.onUserDisconnect);
		
		chatStore.addRoomChangeListener(this.onRoomChange);
		chatStore.addConnectResponseListener(this.onConnectResponse);
	},

	componentWillUnmount: function()
	{
		chatStore.removeConnectListener(this.onUserConnect);
		chatStore.removeDisconnectListener(this.onUserDisconnect);
		
		chatStore.removeRoomChangeListener(this.onRoomChange);
		chatStore.removeConnectResponseListener(this.onConnectResponse);
	},

	getInitialState: function()
	{
		return { users: [ ] };
	},

	render: function()
	{
		var me = this.state.me;
		var users = this.state.users;
		return (
			<div className="flexbox">
				<Label bsStyle="primary">Users</Label>
				<ListGroup>
					{ users.map(function(u) { if (me && me.ClientID === u.ClientID) return <ListGroupItem key={u.ClientID}><b>{u.UserName}</b></ListGroupItem>; else return <ListGroupItem key={u.ClientID}>{u.UserName}</ListGroupItem>; }) }
				</ListGroup>
			</div>
		);
	}
};

var React = require("react");
var UserList = React.createClass(UserListSpec);
module.exports = UserList;