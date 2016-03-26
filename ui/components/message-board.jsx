var Well = require("react-bootstrap").Well;
var ListGroup = require("react-bootstrap").ListGroup;
var ListGroupItem = require("react-bootstrap").ListGroupItem;

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
	},

	componentDidMount: function()
	{
		chatStore.addPostMessageListener(this.onPostMessage);
	},

	componentWillUnmount: function()
	{
		chatStore.removePostMessageListener(this.onPostMessage);
	},

	getInitialState: function()
	{
		return { chatMessages: [ ] };
	},

	render: function()
	{
		var chatMessages = this.state.chatMessages;
		return (
			<Well>
				<ListGroup>
					{ chatMessages.map(function(m, i) { return <ListGroupItem key={i}>[{m.DateTime.toLocaleString()}] <b>{m.User.UserName}</b>: {m.Message}</ListGroupItem>; }) }
				</ListGroup>
			</Well>
		);
	}
};

var React = require("react");
var MessageBoard = React.createClass(MessageBoardSpec);
module.exports = MessageBoard;