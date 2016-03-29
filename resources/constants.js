var constants =
{
	Chat:
	{
		Actions:
		{
			Connect: "CHAT.COMMAND.CONNECT",
			Disconnect: "CHAT.COMMAND.DISCONNECT",
			PostMessage: "CHAT.COMMAND.POST_MESSAGE",
			JoinChatRoom: "CHAT.COMMAND.JOIN_ROOM",
			LeaveChatRoom: "CHAT.COMMAND.LEAVE_ROOM",
			
			ConnectResponse: "CHAT.RESPONSE.CONNECT",
			DisconnectResponse: "CHAT.RESPONSE.DISCONNECT",
			PostMessageResponse: "CHAT.RESPONSE.POST_MESSAGE",
			JoinChatRoomResponse: "CHAT.RESPONSE.JOIN_ROOM",
			LeaveChatRoomResponse: "CHAT.RESPONSE.LEAVE_ROOM"
		}
	}
}

module.exports = constants;