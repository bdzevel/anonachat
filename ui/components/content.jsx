var Row = require("react-bootstrap").Row;
var Col = require("react-bootstrap").Col;
var Grid = require("react-bootstrap").Grid;
var Well = require("react-bootstrap").Well;
var ListGroup = require("react-bootstrap").ListGroup;
var ListGroupItem = require("react-bootstrap").ListGroupItem;

var ChatStore = require("../stores/chat-store.js");
var constants = require("../../resources/constants.js");

var ContentSpec =
{
	OnConnect: function(message)
	{
		var clientInfo = message.getParameter("Client");
		this.state.users.push(clientInfo);
		this.setState({ users: this.state.users });
	},

	OnDisconnect: function(message)
	{
		var clientInfo = message.getParameter("Client");
		var user = this.state.users.find(function(client) { return client.ClientID === clientInfo.ClientID; });
		this.state.users.remove(user);
		this.setState({ users: this.state.users });
	},

	OnPostMessage: function(message)
	{
		let chatMessage = message.getParameter("Message");
		let clientInfo = msg.getParameter("Client");
		let dateTime = msg.getParameter("DateTime");
		this.state.chatMessages.push({ DateTime: dateTime, User: clientInfo.UserName, Message: chatMessage });
		this.setState({ chatMessages: this.state.chatMessages });
	},

	componentDidMount: function()
	{
		ChatStore.AddConnectListener(this.OnConnect);
		ChatStore.AddDisconnectListener(this.OnDisconnect);
		ChatStore.AddPostMessageListener(this.OnPostMessage);
	},

	componentWillUnmount: function()
	{
		ChatStore.RemoveConnectListener(this.OnConnect);
		ChatStore.RemoveDisconnectListener(this.OnDisconnect);
		ChatStore.RemovePostMessageListener(this.OnPostMessage);
	},

	getInitialState: function()
	{
		return { chatMessages: [ ], users: [ ] };
	},

	render: function()
	{
		var users = this.state.users;
		var chatMessages = this.state.chatMessages;
		return (
			<div className="container-fluid">
				<Well>
					<Grid fluid>
						<Row>
							<Col md={8}>
								<ListGroup>
									{ chatMessages.map(function(m) { return <ListGroupItem>[{m.DateTime}] {m.UserName}: {m.Message}</ListGroupItem>; }) }
								</ListGroup>
							</Col>
							<Col md={4}>
								<ListGroup>
									{ users.map(function(u) { return <ListGroupItem>{u.UserName}</ListGroupItem>; }) }
								</ListGroup>
							</Col>
						</Row>
					</Grid>
				</Well>
			</div>
		);
	}
};

var React = require("react");
var Content = React.createClass(ContentSpec);
module.exports = Content;