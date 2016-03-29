let TS = require("../../diagnostics/trace-sources").Get("Web-Server");

let constants = require("../../resources/constants").Chat;

let Message = require("../command/message");
let ClientProxy = require("./client-proxy");

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
		this.commandService = require("../command/command-service");
		this.initializeWebServer();
        this.initializeWebSocketListener();
	}
	
	initializeWebServer()
	{
		this.webServer = { };
		let configurationService = require("../configuration/configuration-service");
		let sslEnabled = configurationService.get("SSL_ENABLED");
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
		this.webServer.on("error", this.onError);
	}
	
	setupHttp()
	{
		TS.TraceVerbose(__filename, "Initializing HTTP server...");

		let http = require("http");
		let handlers = this.setupHttpHandlers();
		let server = http.createServer(handlers);

		TS.TraceVerbose(__filename, "Finished initializing HTTP server");
		
		return server;
	}
	
	setupHttps()
	{
		TS.TraceVerbose(__filename, "Initializing HTTPS server...");

		let https = require("https");
		let handlers = this.setupHttpHandlers();

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

		TS.TraceVerbose(__filename, "Finished initializing HTTPS server");
		
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
		app.use(express.static(path.join(__dirname, "..", "..", "public")));

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

		TS.TraceVerbose(__filename, "Finished initializing HTTP request handlers");
		
		return app;
	}
	
	initializeWebSocketListener()
	{
		TS.TraceVerbose(__filename, "Initializing web socket listener...");
		let Primus = require("primus");
		this.webSocketListener = new Primus(this.webServer, { transformer: "engine.io" });
		this.setupWebSocketHandlers();
		TS.TraceVerbose(__filename, "Finished initializing web socket listener...");
	}

	setupWebSocketHandlers()
	{
		this.webSocketListener.on("connection", this.onConnect);
		this.webSocketListener.on("disconnection", this.onDisconnect);
	}
	
	start()
	{
		let configurationService = require("../configuration/configuration-service");
		const port = configurationService.get("PORT");
		TS.TraceVerbose(__filename, "Starting web server on port " + port);
		this.webServer.listen(port);
		TS.TraceVerbose(__filename, "Started web server");
	}
	
	onConnect(spark)
	{
		let commandService = require("../command/command-service");
		
		spark.on('data', function(data) {
			if (!data.Message)
			{
				TS.TraceError(__filename, "Data received, but no message specified");
				return;
			}
			let message = Message.fromJson(data.Message);
			commandService.handle(message, proxy);
		});
		
		let message = new Message(constants.Actions.Connect);
		let proxy = new ClientProxy(spark);
		commandService.handle(message, proxy);
	}
	
	onDisconnect(spark)
	{
		let chatService = require("../chat/chat-service");
		let commandService = require("../command/command-service");
		
		let message = new Message(constants.Actions.Disconnect);
		let proxy = chatService.findClient(spark.id);
		commandService.handle(message, proxy);
	}

	onError(error)
	{
		if (error.syscall !== "listen")
		{
			throw error;
		}

		let configurationService = require("../configuration/configuration-service");
		let port = configurationService.get("PORT");
		let bind = typeof port === "string"
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