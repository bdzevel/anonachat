var data = require("../../data");

function DELETE(request, response)
{
	var name = request.params["name"];
	for (var i in data)
	{
		if (data[i].name === name)
		{
			console.error(name + " found!");
			data.splice(1, i);
			response.status(200).end();
			return;
		}
	}
	
	console.error(name + " not found");
	response.status(500).send({ error: name + " not found" });
	return;
};

module.exports = DELETE;