"use strict";

let TS = require("../diagnostics/trace-sources").Get("Web-Server");

let env = require("../config/environment");

let server = InitializeServer();
server.on("error", OnError);

let options =
{
	transformer: "engine.io",
	port: process.env.PORT || env.get("PORT") || 3000
};

TS.TraceVerbose(__filename, "Starting web server on port " + options.port);

let Primus = require("primus");
var primus = new Primus(server, options);
primus.on("connection", function (spark) {
	console.log(">>> connection");
	console.log(spark);
	console.log(">>> /connection");
});
primus.on("data", function message(data) {
	console.log('>>> data');
	console.log(data);
	console.log('>>> /data');
});
primus.on("disconnection", function (spark) {
	console.log(">>> disconnection");
	console.log(spark);
	console.log(">>> /disconnection");
});
primus.on("end", function (spark) {
	console.log('>>> end');
	console.log(spark);
	console.log('>>> /end');
});
primus.on("error", OnError);

server.listen(options.port);

TS.TraceVerbose(__filename, "Started web server");

//primus.save(__dirname + "/primus.js");

function InitializeServer()
{
	let sslEnabled = env.get("SSL_ENABLED");
	if (sslEnabled === 0)
	{
		let server = require("./http-server");
		return server;
	}
	else if (sslEnabled === 1)
	{
		let server = require("./https-server");
		return server;
	}
	
	TS.TraceError(__filename, "SSL_ENABLED option must be either '0' or '1'");
	process.exit(2);
}

function OnError(error)
{
	if (error.syscall !== "listen")
	{
		throw error;
	}

	var bind = typeof options.port === "string"
		? "Pipe " + options.port
		: "Port " + options.port;

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