"use strict";

let TS = require("../diagnostics/trace-sources").Get("Web-Server");

TS.TraceVerbose(__filename, "Initializing request handlers...");

let express = require("express");
let app = express();

let logger = require("morgan");
app.use(logger("dev"));

let bodyParser = require("body-parser");
app.use(bodyParser.json());

let path = require("path");
app.use(express.static(path.join(__dirname, "..", "public")));

// Front end
// app.get("/", function (req, res) { res.sendFile("index.html"); });

// API
// let authRoutes = require("../api/authentication/routes");
// app.use("/api/authentication", authRoutes);
// let usersRoutes = require("../api/users/routes");
// app.use("/api/users", usersRoutes);
// let goalRoutes = require("../api/goals/routes");
// app.use("/api/goals", goalRoutes);

// catch 404 and forward to error handler
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

TS.TraceVerbose(__filename, "Request handlers initialized...");

module.exports = app;