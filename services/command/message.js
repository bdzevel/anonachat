let Variable = require("./variable");

class Message
{
	constructor(symbol)
	{
		this.Symbol = symbol;
		this.Parameters = [ ];
	}
	
	static fromJson(json)
	{
		let msg = new Message(json.Symbol);
		json.Parameters.forEach(function(parm) { msg.addParameter(parm.Name, parm.Value); }, this);
		return msg;
	}
	
	addParameter(name, value)
	{
		if (this.containsParameter(name))
			throw "Parameter with name '" + name + "' already added";
		this.Parameters.push(new Variable(name, value));
	}
	
	containsParameter(name)
	{
		if (this.getParameter(name))
			return true;
		return false;
	}
	
	getParameter(name)
	{
		let parm = this.Parameters.find(function(parm) { return parm.Name === name; });
		if (!parm)
			return null;
		return parm.Value;
	}
}

module.exports = Message;