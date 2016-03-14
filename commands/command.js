"use strict";

let CommandArgument = require("./command-argument");

class Command
{
	constructor(symbol)
	{
		this.Symbol = symbol;
		this.Arguments = [ ];
	}
	
	addArgument(argument)
	{
		if (!(argument instanceof CommandArgument))
			throw "Argument not of type 'CommandArgument'";
		else if (this.containsArgument(argument.Name))
			throw "Argument with name '" + argument.Name + "' already added";
		this.Arguments.push(argument);
	}
	
	addArgument(name, value)
	{
		let arg = new CommandArgument(name, value);
		this.addArgument(arg);
	}
	
	containsArgument(name)
	{
		if (this.getArgument(name))
			return true;
		return false;
	}
	
	getArgument(name)
	{
		let arg = this.find(function(arg, index, array) { return arg.Name === name; });
		return arg;
	}
}

module.exports = Command;