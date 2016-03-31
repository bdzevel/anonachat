var ListGroupItem = require("react-bootstrap").ListGroupItem;

var SystemMessageSpec =
{
	render: function()
	{
		return (
			<ListGroupItem>[{this.props.DateTime.toLocaleString()}] <i>{this.props.Message}</i></ListGroupItem>
		);
	}
};

var React = require("react");
var SystemMessage = React.createClass(SystemMessageSpec);
module.exports = SystemMessage;