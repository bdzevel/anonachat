Anonachat
=====

An anonymous chat application application written in JavaScript, for practice.

* Node.js is the back end

Authored by Boris Dzevel

NOTES:

The "util" folder contains some helpful scripts:

1)

	generate-certificates.ps1
	A PowerShell script to generate the appropriate certificates that could be used for testing.
	It's not recommended to use these certificates for anything real because they won't be trusted by anyone.
	
2)

	install-cli-utils.ps1
	A PowerShell script that will install the necessary CLI utilities like grunt.
	This is easy enough to do manually. I just wanted a reminder of what I needed.
	
The app needs root-ca.crt.pem, server.key.pem, and server.crt.pem files at root (not checked in), for SSL. You can generate these using the script mentioned above and just move them to the root.

Needs .env file at root (not checked in), with following (JSON) structure:

	{
		"ANONACHAT_ENVIRONMENT": "development/production",
		"ANONACHAT_SSL_ENABLED": "0/1"
	}