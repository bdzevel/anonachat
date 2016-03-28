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
			TS.TraceVerbose(__filename, "Invalid type for 'message'");
			return;
		}
		let handler = this.getHandler(message.Symbol);
		if (!handler)
		{
			TS.TraceVerbose(__filename, "No handler registered for message '" + message.Symbol + "'");
			return;
		}
		let response = handler.Callback.call(handler.Service, message, context);
		if (response)
			context.write({ Message: response });
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