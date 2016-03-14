"use strict";

class CommandHandler
{
	constructor(symbol, callback)
	{
		this.Symbol = symbol;
		this.Callback = callback;
	}
}

module.exports = CommandHandler;