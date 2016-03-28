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
		this.scrollToBottom();
	},
	
	scrollToBottom: function()
	{
		var list = $("#chat-message-list");
		list.scrollTop(list.prop("scrollHeight"));
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
		return (
			<div className="flexbox">
				<Label bsStyle="primary">Messages</Label>
				<ChatMessageList id="chat-message-list" className="scrollable"
					chatMessages={this.state.chatMessages} />
				<ChatForm className="footer" />
			</div>
		);
	}
};

var React = require("react");
var MessageBoard = React.createClass(MessageBoardSpec);
module.exports = MessageBoard;