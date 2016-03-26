var ListGroupItem = require("react-bootstrap").ListGroupItem;

var MessageBoardSpec =
{
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
			<ListGroupItem key={i}>[{m.DateTime.toLocaleString()}] <b>{m.User.UserName}</b>: {m.Message}</ListGroupItem>
		);
	}
};

var React = require("react");
var MessageBoard = React.createClass(MessageBoardSpec);
module.exports = MessageBoard;