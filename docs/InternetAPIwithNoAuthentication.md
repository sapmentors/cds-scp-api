# CDS-SCP-API Node Module Example

## SAP Cloud Platform Internet Destinations with No Authentication 
This example is based on demo OData service API of odata.org which doesn't need an authentication
The API can be found at https://services.odata.org/v4/Northwind/Northwind.svc/

### Destination Configuration in SAP Cloud Platform Destination Service

![Destination Configuration](./pictures/DestinationInternetWithNoAuthentication.png)

## Javascript/Node.js Code
```javascript
const cdsapi = require("@sapmentors/cds-scp-api");

async function InternetAPIGetRequestwithNoAuthentication() {
	const service = await cdsapi.connect.to("Northwind");
	// HTTP GET request based on Axios
	return await service.run({
		url: "/Products?$top=2",
		header: {
			'content-type': 'application/json'
		},
		transformResponse: ((data) => {
			return (data)
		})
	})
}

InternetAPIGetRequestwithNoAuthentication()
	.then((data) => {
        let result = JSON.parse(data)
		console.log(result.value[0].ProductName)
	})
```
## Output Javascript/Node.js Code
```javascript
Chai
```