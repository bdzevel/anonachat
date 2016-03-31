var ListGroup = require("react-bootstrap").ListGroup;

var ChatMessage = require("./chat-message.jsx");
var SystemMessage = require("./system-message.jsx");

var ChatMessageListSpec =
{
	render: function()
	{
		var me = this.props.me;
		return (
			<ListGroup id={this.props.id} className={this.props.className}>
				{ this.props.chatMessages.map(function(m, i) {
					if (!m.User)
						return <SystemMessage key={i} DateTime={m.DateTime} Message={m.Message} />;
					var isSelf = me.ClientID === m.User.ClientID;
					return <ChatMessage key={i} IsSelf={isSelf} DateTime={m.DateTime} UserName={m.User.UserName} Message={m.Message} />;
				}) }
			</ListGroup>
		);
	}
};

var React = require("react");
var ChatMessageList = React.createClass(ChatMessageListSpec);
module.exports = ChatMessageList;