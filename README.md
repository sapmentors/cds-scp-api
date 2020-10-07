# CDS-SCP-API Node Module 

## CDS Extension for SAP Cloud Platform API Consumption
The idea of this module is based on Jhodel Cailan CDSE module.

This node module simplifies the consuming external API in a Cloud Application Programming (CAP) Model.
The users can use the raw capabilities of **axios** node module while still utilizing the following capabilites of CAP framework and SAP Cloud Platform:
- Fluent api concept
- Configure SAP Cloud Platform Destination and Connectivity services
- CDS configuration found in **package.json**
- Reuse Axios options for calling API

## Installation

Using npm:

```swift
> npm install cds-scp-api
```
## Supported Destination Types

- Internet Destinations with No Authorization 
- Internet Destinations with Basic Authorization
- Internet Destinations with Client Credentionals (including Microsoft Azure)
- Internet Destinations with JWT token (currently only Google Cloud Platform)


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

- [SAP Cloud Platform Internet Destinations with No Authorization](./docs/InternetAPIwithNoAuthentication.md)
- [SAP Cloud Platform Internet Destinations with Basic Authorization](./docs/InternetAPIwithBasicAuthentication.md)
- [SAP Cloud Platform Internet Destinations for Microsoft 365/Azure via MSGraph ](./docs/InternetAPIforAzure.md)
- [SAP Cloud Platform Internet Destinations for GSuite/Google Cloud Platform ](./docs/InternetAPIforGCP.md)

## CDS-SCP-API Config Settings
The CDS-SCP-API is a SAP Cloud Platform layer on top of Axios. The configuration settings of the CDS-SCP-API **service.run** code is simular to Axios options, which can be found [here](https://github.com/axios/axios#request-config). Keep in mind that the SAP Cloud Platform Destination and Connectivity services will provide the authentification and proxy settings and will provide the baseURL and those settings set in the Axios options will be ignored.

- Axios implementation
  ```javascript
  async function AxiosGetRequestwithBasicAuthorization() {
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
  async function InternetAPIGetRequestwithBasicAuthorization() {
	  const service = await cdsapi.connect.to("ES5");
	  return await service.run({
		  url: "/sap/opu/odata/sap/EPM_REF_APPS_SHOP_SRV/Products?$top=2"
	  })
  }  
  ```
CDS-SCP-API implementation uses relative URLs and authorization is configured in the SAP Cloud Platform and handled by the CDS-SCP-API implementation.

## Testing Program for Node Module
Under Construction
