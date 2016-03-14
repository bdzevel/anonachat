"use strict";

let TS = require("../diagnostics/trace-sources").Get("Web-Server");

let env = require("../config/environment");
const port = process.env.PORT || env.get("PORT") || 3000;

let server = InitializeServer();
let primus = require("./ws-endpoint")(server);

TS.TraceVerbose(__filename, "Starting web server on port " + port);

server.listen(port);

TS.TraceVerbose(__filename, "Started web server");

function InitializeServer()
{
	let server = { };
	let sslEnabled = env.get("SSL_ENABLED");
	if (sslEnabled === 0)
	{
		server = require("./http-server");
	}
	else if (sslEnabled === 1)
	{
		server = require("./https-server");
	}
	else
	{
		TS.TraceError(__filename, "SSL_ENABLED option must be either '0' or '1'");
		process.exit(2);
	}
	server.on("error", OnError);
	return server;
}

function OnError(error)
{
	if (error.syscall !== "listen")
	{
		throw error;
	}

	var bind = typeof port === "string"
		? "Pipe " + port
		: "Port " + port;

	// handle specific listen errors with friendly messages
	switch (error.code)
	{
		case "EACCES":
			TS.TraceError(__filename, bind + " requires elevated privileges");
			process.exit(1);
			break;
		case "EADDRINUSE":
			TS.TraceError(__filename, bind + " is already in use");
			process.exit(1);
			break;
		default:
			throw error;
	}
}