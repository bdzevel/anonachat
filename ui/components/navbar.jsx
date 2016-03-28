var Nav = require("react-bootstrap").Nav;
var Navbar = require("react-bootstrap").Navbar;
var NavItem = require("react-bootstrap").NavItem;
var Input = require("react-bootstrap").Input;
var Button = require("react-bootstrap").Button;

var chatStore = require("../stores/chat-store.js");

var NavBarSpec =
{
	onConnectResponse: function(message)
	{
		var client = message.getParameter("Client");
		this.setState({ userName: client.UserName });
	},
	
	componentDidMount: function()
	{
		chatStore.addConnectResponseListener(this.onConnectResponse);
	},
	
	componentWillUnmount: function()
	{
		chatStore.removeConnectResponseListener(this.onConnectResponse);
	},
	
	getInitialState: function()
	{
		return { userName: "N/A" };
	},
	
	render: function()
	{
		var navBar = (
			<Navbar fluid>
				<Navbar.Header>
					<Navbar.Brand>
						<a href="#">Anonachat</a>
					</Navbar.Brand>
					<Navbar.Toggle />
				</Navbar.Header>
				<Navbar.Collapse>
					<Navbar.Form pullLeft>
						<Input type="text" placeholder="Join chatroom" />
						<Button type="submit">Join</Button>
					</Navbar.Form>
					<Navbar.Text pullRight>
						Signed in as: {this.state.userName}
					</Navbar.Text>
				</Navbar.Collapse>
			</Navbar>
		);
		return navBar;
	}
};

var React = require("react");
var NavBar = React.createClass(NavBarSpec);
module.exports = NavBar;