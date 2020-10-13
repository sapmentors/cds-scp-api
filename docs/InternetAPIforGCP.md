# CDS-SCP-API Node Module Example

## SAP Cloud Platform Internet Destinations for Google Cloud Platform 
This example uses Google Cloud Platform API for reading all users' full profiles. 
- The setup of Google Cloud Platform for this module can be found [here](GoogleCloudPlatformConfiguration.md)
- Information about the API can be found at [G Suite Admin SDK - Directory API documentation](https://developers.google.com/admin-sdk/directory/v1/reference).

## Google Cloud Platform Examples
- Read user list from Google Cloud Platform - Standalone Node.js/Javascript Example (under construction)

- Provide user list from Google Cloud Platform as CAP CDS External Service - Cloud Application Model Example (under construction)

## Destination Configuration in SAP Cloud Platform Destination Service 

![Destination Configuration](./pictures/DestinationInternetForGoogleCloudPlatform.png)

```text
URL                    : https://www.googleapis.com
Client ID              : <OAuth 2.0 Client ID of the Google Service API Credential page>
Client Secret          : <content of google service account private key JSON file>
Token Service URL      : https://oauth2.googleapis.com/token
jwt.scope              : https://www.googleapis.com/auth/admin.directory.user
jwt.sub                : <A delegated email address of the Google Suite>
jwts.expiration-time   : 3600
jwts.signing-algorithm : RS256
jwts.type              : gcp_service_account
```

Remark:
- **jwts** are the JSON Web Token Settings for the CDS-SCP-API implementation. At this moment, only jwts.type **gcp_service_account** is supported.
- **jwt** are the JSON Web Token Claims, which can be found [here](https://www.iana.org/assignments/jwt/jwt.xhtml) and added as SAP Cloud Platform destination additional properties.
- The CDS-SCP-API implementation for jwts.type **gcp_service_account** will set the JWT claim values for **iss** and **aud** from the Client Secret, use the current time for the JWT claim **iat**, and add the jwts.expiration-time to the current time as value for the JWT claim **exp**.



## Javascript/Node.js Code
```javascript
const cdsapi = require("@sapmentors/cds-scp-api");

async function InternetAPIGetRequestforGoogleCloudPlatform() {
	const domain = '<your-google-cloud-platform-domain>'
	const service = await cdsapi.connect.to("GSUITE_JWT")
	return await service.run({
		url: `/admin/directory/v1/users?domain=${domain}`,
		method: `GET`
	})
}

InternetAPIGetRequestforGoogleCloudPlatform()
	.then((data) => {
		console.log(data.users[0].fullName)
	})
```
## Output Javascript/Node.js Code (in our case)
```javascript
Robert Eijpe
```