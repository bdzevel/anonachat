"use strict";

let TS = require("../diagnostics/trace-sources").Get("Configuration-Service");

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
		this.Properties = new Habitat("ANONACHAT");
		if (!this.Properties.get("PORT"))
			this.Properties.set("PORT", 3000);
	}
	
	get(property)
	{
		return this.Properties.get(property);
	}
	
	set(name, value)
	{
		this.Properties.set(name, value);
	}
}

module.exports = new ConfigurationService();