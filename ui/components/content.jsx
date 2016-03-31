var Row = require("react-bootstrap").Row;
var Col = require("react-bootstrap").Col;
var Grid = require("react-bootstrap").Grid;

var UserList = require("./user-list.jsx");
var MessageBoard = require("./message-board.jsx");

var ContentSpec =
{
	render: function()
	{
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