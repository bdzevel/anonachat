let TraceSource = require("./trace-source");

let TraceSources = { };
TraceSources.Get = function(name)
{
	if (!this[name])
		this[name] = new TraceSource(name);
	return this[name];
}

module.exports = TraceSources;