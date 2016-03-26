var Row = require("react-bootstrap").Row;
var Col = require("react-bootstrap").Col;
var Grid = require("react-bootstrap").Grid;
var Well = require("react-bootstrap").Well;
var ListGroup = require("react-bootstrap").ListGroup;
var ListGroupItem = require("react-bootstrap").ListGroupItem;

var UserList = require("./user-list.jsx");
var MessageBoard = require("./message-board.jsx");

var chatStore = require("../stores/chat-store.js");

var ContentSpec =
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
		var me = this.state.me;
		var chatMessages = this.state.chatMessages;
		return (
			<Grid fluid>
				<Row>
					<Col xs={12} sm={8}>
						<MessageBoard />
					</Col>
					<Col xsHidden sm={4}>
						<UserList />
					</Col>
				</Row>
			</Grid>
		);
	}
};

var React = require("react");
var Content = React.createClass(ContentSpec);
module.exports = Content;