"use strict";

let TS = require("../diagnostics/trace-sources").Get("Web-Server");

function InitializeWebSocketEndpoint(server)
{
	TS.TraceVerbose(__filename, "Initializing HTTP server...");
	let Primus = require("primus");
	let primus = new Primus(server, { transformer: "engine.io" });
	require("../handlers/web-sockets")(primus);
	//primus.save(__dirname + "/primus.js");
	return primus;
}

module.exports = InitializeWebSocketEndpoint;