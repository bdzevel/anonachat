"use strict";

class User
{
	constructor(id, name)
	{
		this.ID = id;
		this.UserName = name;
		this.LastAccess = Date.now();
	}
}

module.exports = User;