"use strict";

let TS = require("../diagnostics/trace-sources").Get("Bootstrapping");

TS.TraceVerbose(__filename, "Initializing services...");

let chatService = require("../services/chat/chat-service");
let webServer = require("../services/web/web-server");
webServer.start();

TS.TraceVerbose(__filename, "Finished initializing services");