var data = require("../../data");

function POST(request, response)
{
	var newDatum = request.body;
	console.log(newDatum);
	data.push({ name: newDatum.name, description: newDatum.description, value: newDatum.value });
	response.status(200).end();
};

module.exports = POST;