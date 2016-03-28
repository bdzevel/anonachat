var ListGroup = require("react-bootstrap").ListGroup;

var ChatMessage = require("./chat-message.jsx");

var ChatMessageListSpec =
{
	render: function()
	{
		return (
			<ListGroup id={this.props.id} className={this.props.className}>
				{ this.props.chatMessages.map(function(m, i) { return <ChatMessage key={i} DateTime={m.DateTime} UserName={m.User.UserName} Message={m.Message} />; }) }
			</ListGroup>
		);
	}
};

var React = require("react");
var ChatMessageList = React.createClass(ChatMessageListSpec);
module.exports = ChatMessageList;