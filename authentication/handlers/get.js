"use strict";

let users = require("../../users/users");

function GET(request, response)
{
	response.status(200).end();
};

module.exports = GET;