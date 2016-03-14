"use strict";

let TS = require("../diagnostics/trace-sources").Get("Command-Service");

let Command = require("../../commands/command");
let CommandHandler = require("./command-handler");

class CommandService
{
	constructor()
	{
		TS.TraceVerbose(__filename, "Initializing Command Service...");
		this.initialize();
		TS.TraceVerbose(__filename, "Finished initializing Command Service...");
	}
	
	initialize()
	{
		this.CommandHandlers = [ ];
	}
	
	register(symbol, callback)
	{
		let handler = new CommandHandler(symbol, callback);
		this.CommandHandlers.push(handler);
	}
	
	invoke(command)
	{
		if (!(command instanceof Command))
			throw "Invalid argument type for 'command'";
		this.CommandHandlers.forEach(function(handler, index) { if (handler.Symbol === command.Symbol) handler.callback(command); })
	}
}

module.exports = new CommandService();