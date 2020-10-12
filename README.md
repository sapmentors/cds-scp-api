# CDS-SCP-API Node Module 

## CDS Extension for SAP Cloud Platform API Consumption
This node module simplifies the consuming external API in a Cloud Application Programming (CAP) Model. 
The users can use the raw capabilities of the **Axios** node module while still utilizing the following capabilities of CAP framework and SAP Cloud Platform:
- Fluent API concept
- Configuration using SAP Cloud Platform Destination and Connectivity services
- Support of SAP OnPremise & Cloud APIs, Microsoft Office 365 APIs, Google Cloud Platform APIs and other REST APIs 
- Uses configuration based on Axios Config options 

## History
Jhodel Cailan initially started the CDS Extension concept. SAP Mentor Robert Eijpe created a similar concept integrating Microsoft Azure and Google Cloud APIs into a CDS external services concept. The SAP Devtoberfest 2020 challenge brought concepts together. And this results in a CDS-SCP-API Node Module for the community, which will make SAP developers life better.

## Installation

Using npm:

```swift
> npm install @sapmentors/cds-scp-api
```
## Supported Destination Types

- Internet Destinations with No Authentication 
- Internet Destinations with Basic Authentication
- Internet Destinations with Client Credentials Authentication (including Microsoft Azure)
- Internet Destinations with JWT token Authentication (currently only Google Cloud Platform)
- OnPremise Destination and Connectivity via Cloud Connector with No Authentication 
- OnPremise Destinations and Connectivity via Cloud Connector with Basic Authentication

## Javascript/Node.js Code
```javascript
// Load the module
const cdsapi = require("cds-scp-api");

// Create a connection
const service = await cdsapi.connect.to("SCPDestination");

// Request the API using Axios Config
let result = await service.run({
               url: "/pathOfService"
             })

```
## SCP Destination Configuration Examples

- [SAP Cloud Platform Internet Destinations with No Authentication](./docs/InternetAPIwithNoAuthentication.md)
- [SAP Cloud Platform Internet Destinations with Basic Authentication](./docs/InternetAPIwithBasicAuthentication.md)
- [SAP Cloud Platform Internet Destinations for Microsoft 365/Azure via MSGraph ](./docs/InternetAPIforAzure.md)
- [SAP Cloud Platform Internet Destinations for GSuite/Google Cloud Platform ](./docs/InternetAPIforGCP.md)

## CDS-SCP-API Config Settings
The CDS-SCP-API is an SAP Cloud Platform layer on top of Axios. The configuration settings of the CDS-SCP-API **service.run** code is simular to Axios options, which are documented [here](https://github.com/axios/axios#request-config). CDS-SCP-API will ignore the Axios config settings for the authentification, the proxy settings, and the baseURL. The CDS-SCP-API retrieves these settings from the SAP Cloud Platform Destination & Connectivity services. 

### Compare Axios with CDS-SCP-API
- Axios implementation
  ```javascript
  async function AxiosGetRequestwithBasicAuthentication() {
	  return await axios({
	  	url: 'https://sapes5.sapdevcenter.com/sap/opu/odata/sap/EPM_REF_APPS_SHOP_SRV/Products?$top=2',
		  auth: {
			  username: '<SAP S-number>',
			  password: '<My password>'
		  }
	  })
  }
  ```

- CDS-SCP-API implementation
  ```javascript
  async function InternetAPIGetRequestwithBasicAuthentication() {
	  const service = await cdsapi.connect.to("ES5");
	  return await service.run({
		  url: "/sap/opu/odata/sap/EPM_REF_APPS_SHOP_SRV/Products?$top=2"
	  })
  }  
  ```
CDS-SCP-API implementation uses relative URLs, and authorization is configured in the SAP Cloud Platform and handled by the CDS-SCP-API implementation.

### Post requests with CSRF token protection
  ```javascript
async function InternetAPIPostRequestwithBasicAuthentication() {
	const product = {
		"ProductID": "NL4B-101",
		"TypeCode": "PR",
		"Category": "Notebooks",
		"Name": "Psychiatric Help",
		"NameLanguage": "EN",
		"Description": "",
		"DescriptionLanguage": "",
		"SupplierID": "0100000000",
		"SupplierName": "SAP",
		"TaxTarifCode": 1,
		"MeasureUnit": "EA",
		"WeightMeasure": "0.000",
		"WeightUnit": "",
		"CurrencyCode": "EUR",
		"Price": "0.05",
		"Width": "0.000",
		"Depth": "0.000",
		"Height": "0.000",
		"DimUnit": "",
		"CreatedAt": "\/Date(1602106635169)\/",
		"ChangedAt": "\/Date(1602106635169)\/"
	}

	const service = await cdsapi.connect.to("ES5");
	return await service.run({
		url: "/sap/opu/odata/IWBEP/GWSAMPLE_BASIC/ProductSet",
		method: "post",
		headers: {
			'content-type': 'application/json'
		},
		data: product,
		csrfProtection: true
	})
}
  ```
When request needs a X-CSRF token to fulfill, you can easily add the setting **csrfProtection: true**

### Simultaneous requests
  ```javascript
async function SimultaneousRequests() {
	const service = await cdsapi.connect.to("ES5")
	axios.all([
		service.run({
			url: "/sap/opu/odata/sap/EPM_REF_APPS_SHOP_SRV/Products?$top=2"
		}),
		service.run({
			url: "/sap/opu/odata/sap/EPM_REF_APPS_SHOP_SRV/Products?$top=3"
		})
	])
		.then(axios.spread((request1, request2) => {
			console.log('Results request1: ', request1.d.results[0].Name);
			console.log('Results request2: ', request2.d.results[0].Name);
		}));

}
  ```
## Example Program for Node Module
Click [here](./examples/readme.md) for examples and environment setup
