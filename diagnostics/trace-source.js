"use strict";

let Severity = require("./severity");

function TraceSource(name)
{
	this.Name = name;
}
TraceSource.prototype.Trace = function(severity, filepath, message)
{
	if (severity == Severity.None)
		return;
	else if (severity == Severity.Information)
		this.TraceInformation(filepath, message);
	else if (severity == Severity.Verbose)
		this.TraceVerbose(filepath, message);
	else if (severity == Severity.Warning)
		this.TraceWarning(filepath, message);
	else if (severity == Severity.Error)
		this.TraceError(filepath, message);
}
TraceSource.prototype.TraceInformation = function(filepath, message)
{
	let msg = FormatMessage(this.Name, filepath, message);
	console.info(msg);
}
TraceSource.prototype.TraceVerbose = function(filepath, message)
{
	let msg = FormatMessage(this.Name, filepath, message);
	console.log(msg);
}
TraceSource.prototype.TraceWarning = function(filepath, message)
{
	let msg = FormatMessage(this.Name, filepath, message);
	console.warn(msg);
}
TraceSource.prototype.TraceError = function(filepath, message)
{
	let msg = FormatMessage(this.Name, filepath, message);
	console.error(msg);
}

function FormatMessage(traceName, filepath, message)
{
	return ("[" + traceName + "] [" + filepath + "] " + message);
}

module.exports = TraceSource;