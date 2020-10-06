# CDS-SCP-API Node Module 

## CDS Extension for SAP Cloud Platform API Consumption
The idea of this module is based on Jhodel Cailan CDSE module.

This node module simplifies the consuming external API in a Cloud Application Programming (CAP) Model.
The users can use the raw capabilities of **axios** node module while still utilizing the following capabilites of CAP framework and SAP Cloud Platform:
- Fluent api concept
- Configure SAP Cloud Platform Destination and Connectivity services
- CDS configuration found in **package.json**

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
```swift
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

## Axios Config Settings
Under Construction

## Testing Program for Node Module
Under Construction
