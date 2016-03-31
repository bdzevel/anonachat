var Input = require("react-bootstrap").Input;
var ButtonInput = require("react-bootstrap").ButtonInput;

var chatActions = require("../actions/chat-actions.js");

var ChatFormSpec =
{
	postMessage: function(e)
	{
		e.preventDefault();
		chatActions.PostMessage(this.props.roomName, this.state.message);
		this.setState(this.getInitialState());
	},

	handleMessageChange: function(e)
	{
		this.setState({ message: e.target.value });
	},

	getInitialState: function()
	{
		return ({ message: "" });
	},

	render: function()
	{
		return (
			<form className={this.props.className} onSubmit={this.postMessage}>
				<Input type="text" label="Message" value={this.state.message} onChange={this.handleMessageChange} />
				<ButtonInput type="submit" value="Post" />
			</form>
		);
	}
};


var React = require("react");
var ChatForm = React.createClass(ChatFormSpec);
module.exports = ChatForm;