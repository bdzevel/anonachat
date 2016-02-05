"use strict";

let TS = require("../diagnostics/trace-sources").Get("Web-Server");

TS.TraceVerbose(__filename, "Initializing HTTPS server...");

let https = require("https");
let handlers = require("./request-handlers");

// These file reads used to be "Promisified" and "Async" but
//	redesign of the structure caused some issues, and
//	honestly async here is unnecessary, as this server must
//	be up for anything to work.
let fs = require("fs");
let httpsOptions =
{
	key: fs.readFileSync("server.key.pem"),
	cert: fs.readFileSync("server.crt.pem")
};
let server = https.createServer(httpsOptions, handlers);

TS.TraceVerbose(__filename, "HTTPS server initialized");

module.exports = server;