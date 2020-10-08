# CDS-SCP-API Node Module Example

## SAP Cloud Platform Internet Destinations with Basic Authentication 
This example uses APIs of the SAP Gateway Demo System **ES5**.
If you don't have access to the SAP Gateway Demo System ES5, you can follow this [tutorial](https://developers.sap.com/tutorials/gateway-demo-signup.html) to get access.

## Basic Authentication Examples
- [Retrieve a product list from public available SAP OData service](./InternetProxy/ReadProductsOfErpWithBasicAuthentication.js) - Standalone Node.js/Javascript Example
- [Create a product with public available SAP OData service](./InternetProxy/CreateProductInErpWithBasicAuthentication.js) - Standalone Node.js/Javascript Example 


## Destination Configuration in SAP Cloud Platform Destination Service

![Destination Configuration](./pictures/DestinationInternetWithBasicAuthentication.png)

## Javascript/Node.js Code
```javascript
const cdsapi = require("@sapmentors/cds-scp-api");

async function InternetAPIGetRequestwithBasicAuthentication() {
	const service = await cdsapi.connect.to("ES5");
	return await service.run({
		url: "/sap/opu/odata/sap/EPM_REF_APPS_SHOP_SRV/Products?$top=2"
	})
}
	
InternetAPIGetRequestwithBasicAuthentication()
	.then((data) => {
		console.log(data.d.results[0].Name)
	})
```
## Output Javascript/Node.js Code
```javascript
'Notebook Basic 15'
```