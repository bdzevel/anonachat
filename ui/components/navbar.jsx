var Nav = require("react-bootstrap").Nav;
var Navbar = require("react-bootstrap").Navbar;
var NavItem = require("react-bootstrap").NavItem;
var Input = require("react-bootstrap").Input;
var Button = require("react-bootstrap").Button;

var chatStore = require("../stores/chat-store.js");
var chatActions = require("../actions/chat-actions.js");

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
		return { roomName: "global", currentRoomName: "global", userName: "N/A" };
	},

	HandleRoomNameChange: function(e)
	{
		this.setState({ roomName: e.target.value });
	},
	
	HandleKeyPress: function(e)
	{
		if (e.keyCode == 13)
			this.ChangeRoom();
	},
	
	ChangeRoom: function(e)
	{
		if (this.state.currentRoomName === this.state.roomName)
			return;
		chatActions.LeaveRoom(this.state.currentRoomName);
		chatActions.JoinRoom(this.state.roomName);
		this.setState({ currentRoomName: this.state.roomName });
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
						<Input type="text" placeholder="Room name" value={this.state.roomName} onChange={this.HandleRoomNameChange} onKeyDown={this.HandleKeyPress} />
						{ " " }
						<Button type="submit" onClick={this.ChangeRoom}>Join</Button>
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