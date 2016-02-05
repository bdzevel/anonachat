#################################################################################
#																				#
#	This script will create the necessary self-signed certificates				#
#	and a fake root certificate authority to make it easy to deploy quickly.	#
#	Note that nobody will trust these certificates, for good reason.			#
#	Adapted from shell script found at...										#
#	https://github.com/coolaj86/nodejs-self-signed-certificate-example			# 
#																				#
#################################################################################

# Some fake info with which we will populate the certificates
# Since this is private, the details can be as bogus as you like
$ComputerInfo = Get-WmiObject Win32_ComputerSystem;
$FQDN = $ComputerInfo.Name + "." + $ComputerInfo.Domain;
$CountryCode = "US";
$State = "New Jersey";
$Organization = "Boris Dzevel";
$CommonName = "herokuapp.com";

$RootCAKey = "root-ca.key.pem";
$RootCACert = "root-ca.crt.pem";
$ServerKey = "server.key.pem";
$ServerCSR = "server.csr.pem";
$ServerCert = "server.crt.pem";
$ServerPub = "server.pub.pem";

# Create your very own Root Certificate Authority
openssl genrsa -out .\root-ca.key.pem 2048;

# Self-sign your Root Certificate Authority
# Since this is private, the details can be as bogus as you like
openssl req -x509 -new -nodes -key $RootCAKey -days 1024 -out $RootCACert -subj "/C=$CountryCode/ST=$State/O=$Organization/CN=$FQDN";

# Create a Device Certificate for each domain,
# such as example.com, *.example.com, awesome.example.com
# NOTE: You MUST match CN to the domain name or ip address you want to use
openssl genrsa -out $ServerKey 2048;

# Create a request from your Device, which your Root CA will sign
openssl req -new -key $ServerKey -out $ServerCSR -subj "/C=$CountryCode/ST=$State/O=$Organization/CN=$FQDN";

# Sign the request from Device with your Root CA
openssl x509 -req -in $ServerCSR -CA $RootCACert -CAkey $RootCAKey -CAcreateserial -out $ServerCert -days 1024;

# Create a public key, for funzies
# see https://gist.github.com/coolaj86/f6f36efce2821dfb046d
openssl rsa -in $ServerKey -pubout -out $ServerPub

Exit 0;