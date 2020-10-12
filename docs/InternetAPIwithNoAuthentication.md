# CDS-SCP-API Node Module Example

## SAP Cloud Platform Internet Destinations with No Authentication 
These destinations are pointing to the demo OData service API https://services.odata.org/v4/Northwind/Northwind.svc/ of odata.org. This API endpoint doesn't need authentication.

## No Authentication Example
- [Retrieve a product list from public available OData Service called Northwind](../examples/InternetProxy/ReadPublicApiNorthwindWithNoAuthentication.js) - Standalone Node.js/Javascript Example

## Destination Configuration in SAP Cloud Platform Destination Service

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
