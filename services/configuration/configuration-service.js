"use strict";

let TS = require("../../diagnostics/trace-sources").Get("Configuration-Service");

class ConfigurationService
{
	constructor()
	{
		TS.TraceVerbose(__filename, "Initializing Configuration Service...");
		this.initialize();
		TS.TraceVerbose(__filename, "Finished initializing Configuration Service");
	}
	
	initialize()
	{
		let Habitat = require("habitat");
		Habitat.load('.env');
		this.properties = new Habitat("ANONACHAT");
	}
	
	get(property)
	{
		return this.properties.get(property);
	}
	
	set(name, value)
	{
		this.properties.set(name, value);
	}
}

module.exports = new ConfigurationService();