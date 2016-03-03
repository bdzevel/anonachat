"use strict";

let User = require("./user");
let nouns  = require("../../words/nouns");
let adjectives = require("../../words/adjectives");

class UserCollection extends Array
{
	cosntructor()
	{
		this.CurrentID = 0;
	}
	
	push(...items)
	{
		for (let item of items)
		{
			if (!(item instanceof User))
				throw "Argument not of type 'User'";
			if (this.containsID(item.ID))
				throw "Collection already contains item with ID '" + item.ID + "'";
		}
		return super.push(items);
	}
	
	remove(user)
	{
		var index = this.indexOf(user);
		if (index == -1)
			return;
		// Free up this ID
		if (user.ID < this.CurrentID)
			this.CurrentID = user.ID;
		this.splice(index, 1);
	}
	
	newUser()
	{
		var id = this.generateUnusedID();
		var name = this.generateUnusedName();
		var user = new User(id, name);
		this.push(user);
		return user;
	}
	
	generateUnusedID()
	{
		var id = this.CurrentID;
		while (this.containsID(++this.CurrentID)) ;
		return id;
	}
	
	generateUnusedName()
	{
		let username = "";
		do
		{
			let adj = adjectives.GetRandomWord();
			let noun = nouns.GetRandomWord();
			username = adj + " " + noun;
		} while (this.containsName(username));
		return username;
	}
	
	containsID(id)
	{
		if (this.find(function(user, index, array) { return user.ID === id; }))
			return true;
		return false;
	}
	
	containsName(name)
	{
		if (this.find(function(user, index, array) { return user.UserName === name; }))
			return true;
		return false;
	}
	
	getByID(id)
	{
		let user = this.find(function(user, index, array) { return user.ID === id; });
		user.LastAccess = Date.now();
		return user;
	}
	
	getByName(name)
	{
		let user = this.find(function(user, index, array) { return user.UserName === name; });
		user.LastAccess = Date.now();
		return user;
	}
}

module.exports = UserCollection;