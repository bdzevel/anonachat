"use strict";

let TS = require("../diagnostics/trace-sources").Get("Web-Server");

function SetupWebSocketHandlers(primus)
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
	
module.exports = SetupWebSocketHandlers;