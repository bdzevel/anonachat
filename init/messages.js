"use strict";

let messages = require("../messages/messages");

// Client Connections
messages.register("CLIENT_CONNECT", "New client connection");
messages.register("CLIENT_DISCONNECT", "Disconnect a client");

// Chat Rooms
messages.register("CHATROOM_JOIN", "Join a chat room");

// Posts
messages.register("MESSAGE_POST", "Post a new message to a chat room");