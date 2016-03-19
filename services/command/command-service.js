"use strict";

let TS = require("../../diagnostics/trace-sources").Get("Command-Service");

let Command = require("./command");
let Response = require("./response");
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
		this.commandHandlers = [ ];
	}
	
	register(symbol, service, callback)
	{
		if (this.isCommandRegistered(symbol))
		{
			TS.TraceError(__filename, "Command '" + symbol + "' already registered");
			return;
		}
		let handler = new CommandHandler(symbol, service, callback);
		this.commandHandlers.push(handler);
	}
	
	invoke(command, context)
	{
		if (!(command instanceof Command))
			throw "Invalid argument type for 'command'";
		let handler = this.getHandler(command.Symbol);
		if (!handler)
		{
			TS.TraceVerbose(__filename, "No handler registered for command '" + command.Symbol + "'");
			return;
		}
		let response = handler.Callback.call(handler.Service, command, context);
		if (response)
			context.write(response);
	}
	
	isCommandRegistered(symbol)
	{
		if (this.getHandler(symbol))
			return true;
		return false;
	}
	
	getHandler(symbol)
	{
		let cmd = this.commandHandlers.find(function(cmd) { return cmd.Symbol === symbol; });
		return cmd;
	}
}

module.exports = new CommandService();