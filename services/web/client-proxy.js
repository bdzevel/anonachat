"use strict";

class ClientProxy
{
	constructor(spark)
	{
		this.Spark = spark;
		this.ClientID = spark.id;
	}
	
	setUserName(userName)
	{
		this.UserName = userName;
	}
	
	write(data)
	{
		this.Spark.write(data);
	}
}

module.exports = ClientProxy;