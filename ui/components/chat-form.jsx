var Input = require("react-bootstrap").Input;
var ButtonInput = require("react-bootstrap").ButtonInput;

var chatActions = require("../actions/chat-actions.js");

var ChatFormSpec =
{
	PostMessage: function(e)
	{
		e.preventDefault();
		chatActions.PostMessage(this.state.message);
		this.setState(this.getInitialState());
	},

	HandleMessageChange: function(e)
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
			<form onSubmit={this.PostMessage}>
				<Input className="user-input" type="text" label="Message" value={this.state.message} onChange={this.HandleMessageChange} />
				<ButtonInput type="submit" value="Post" />
			</form>
		);
	}
};


var React = require("react");
var ChatForm = React.createClass(ChatFormSpec);
module.exports = ChatForm;