let TS = require("../../diagnostics/trace-sources").Get("Command-Service");

let Message = require("./message");
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
		if (this.isMessageRegistered(symbol))
		{
			TS.TraceError(__filename, "Message '" + symbol + "' already registered");
			return;
		}
		let handler = new CommandHandler(symbol, service, callback);
		this.commandHandlers.push(handler);
	}
	
	handle(message, context)
	{
		if (!(message instanceof Message))
		{
			TS.TraceError(__filename, "Invalid type for 'message'");
			return;
		}
		TS.TraceVerbose(__filename, "Received " + message.Symbol);
		let handler = this.getHandler(message.Symbol);
		if (!handler)
		{
			TS.TraceWarning(__filename, "No handler registered for message '" + message.Symbol + "'");
			return;
		}
		let response = handler.Callback.call(handler.Service, message, context);
		if (response)
		{
			TS.TraceVerbose(__filename, "Sending " + response.Symbol);
			context.write({ Message: response });
		}
		TS.TraceVerbose(__filename, "Finished handling '" + message.Symbol + "'");
	}
	
	isMessageRegistered(symbol)
	{
		if (this.getHandler(symbol))
			return true;
		return false;
	}
	
	getHandler(symbol)
	{
		let handler = this.commandHandlers.find(function(handler) { return handler.Symbol === symbol; });
		return handler;
	}
}

module.exports = new CommandService();