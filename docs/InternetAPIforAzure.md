# CDS-SCP-API Node Module Example

## SAP Cloud Platform Internet Destinations for Microsoft 365 (including Azure and Office 365 APIs) 
This example is based Microsoft Graph API for Read all users' full profiles. 
The API can be found at [Microsoft Graph REST API v1.0 documentation](https://docs.microsoft.com/en-us/graph/api/user-list?view=graph-rest-1.0&tabs=http).
The setup in Microsoft Azure can be found [here](AzureMSGraphConfiguration.md)

### Destination Configuration in SAP Cloud Platform Destination Service

![Destination Configuration](./pictures/DestinationInternetForMicrosoft365.png)


Scope:

## Javascript/Node.js Code
```javascript
const cdsapi = require("@sapmentors/cds-scp-api");

async function InternetAPIGetRequestforMicrosoft365() {
	const service = await cdsapi.connect.to("MicrosoftGraph");
	return await service.run({
		url: "/v1.0/users?$select=displayName,givenName,postalCode",
		method: 'GET'
	})
}

InternetAPIGetRequestforMicrosoft365()
	.then((data) => {
		console.log(data.value[0].displayName)
	})
```
## Output Javascript/Node.js Code (in our case)
```javascript
Robert Eijpe
```