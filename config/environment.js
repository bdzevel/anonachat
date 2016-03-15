"use strict";

let Habitat = require("habitat");
Habitat.load('.env');
let env = new Habitat("ANONACHAT");

module.exports = env;