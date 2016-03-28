class CommandHandler
{
	constructor(symbol, service, callback)
	{
		this.Symbol = symbol;
		this.Service = service;
		this.Callback = callback;
	}
}

module.exports = CommandHandler;