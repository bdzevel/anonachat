"use strict";

let TS = require("../diagnostics/trace-sources").Get("Web-Server");

class WebServer
{
	constructor()
	{
		TS.TraceVerbose(__filename, "Initializing Web Server...");
		this.initialize();
		TS.TraceVerbose(__filename, "Finished initializing Web Server");
	}
	
	initialize()
	{
		this.configurationService = require("../configuration/configuration-service");
		initializeWebServer();
	}
	
	initializeWebServer()
	{
		this.webServer = { };
		let sslEnabled = this.configurationService.get("SSL_ENABLED");
		if (sslEnabled === 0)
		{
			this.webServer = this.setupHttp();
		}
		else if (sslEnabled === 1)
		{
			this.webServer = this.setupHttps();
		}
		else
		{
			TS.TraceError(__filename, "SSL_ENABLED option must be either '0' or '1'");
			process.exit(2);
		}
		server.on("error", OnError);
		let primus = require("./ws-endpoint")(server);
		return server;
	}
	
	setupHttp()
	{
		TS.TraceVerbose(__filename, "Initializing HTTP server...");

		let http = require("http");
		let handlers = this.setupHandlers();
		let server = http.createServer(handlers);

		TS.TraceVerbose(__filename, "HTTP server initialized");
		
		return server;
	}
	
	setupHttps()
	{
		TS.TraceVerbose(__filename, "Initializing HTTPS server...");

		let https = require("https");
		let handlers = this.setupHandlers();

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
		
		return server;
	}
	
	setupHttpHandlers()
	{
		TS.TraceVerbose(__filename, "Initializing HTTP request handlers...");

		let express = require("express");
		let app = express();

		let logger = require("morgan");
		app.use(logger("dev"));

		let bodyParser = require("body-parser");
		app.use(bodyParser.json());

		let path = require("path");
		app.use(express.static(path.join(__dirname, "..", "public")));

		// Catch 404 and forward to error handler
		app.use(function (req, res, next)
		{
			let err = new Error("Not Found");
			err.status = 404;
			next(err);
		});

		app.use(function (err, req, res, next)
		{
			TS.TraceError(__filename, err.message);
			res.status(err.status || 500).send({ error: err.message });
		});

		TS.TraceVerbose(__filename, "HTTP request handlers initialized");
		
		return app;
	}
	
	start()
	{
		TS.TraceVerbose(__filename, "Starting web server on port " + port);

		const port = this.configurationService.get("PORT");
		server.listen(port);

		TS.TraceVerbose(__filename, "Started web server");
	}
	
	InitializeWebSocketEndpoint(server)
	{
		TS.TraceVerbose(__filename, "Initializing HTTP server...");
		let Primus = require("primus");
		let primus = new Primus(server, { transformer: "engine.io" });
		require("../handlers/web-sockets")(primus);
		//primus.save(__dirname + "/primus.js");
		return primus;
	}

	SetupWebSocketHandlers(primus)
	{
		primus.on("connection", function (spark) {
			console.log(">>> connection");
			console.log(spark);
			spark.write("HELLOY MESSAGE");
			console.log(">>> /connection");
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
		primus.on("data", function message(data) {
			console.log('>>> data');
			console.log(data);
			console.log('>>> /data');
		});
	}

	OnError(error)
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
}

module.exports = new WebServer();