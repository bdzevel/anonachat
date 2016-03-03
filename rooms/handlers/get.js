var data = require("../../data");

function GET(request, response)
{
	response.status(200).send({ data: data });
};

module.exports = GET;