"use strict";

let TS = require("../diagnostics/trace-sources").Get("Initialization");

TS.TraceVerbose(__filename, "Initializing services...");

let webServer = require("../services/web/web-server");

TS.TraceVerbose(__filename, "Finished initializing services");