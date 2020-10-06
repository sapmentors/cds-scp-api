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

Internet Destinations with No Authorization 
Internet Destinations with Basic Authorization
Internet Destinations with Client Credentionals (including Microsoft Azure)
Internet Destinations with Client Credentionals (currently only Google Cloud Platform[GCP])



## Javascript/Node.js Code
```swift
// Load the module
const cdsapi = require("cds-scp-api");

// Create a connection
const service = await cdsapi.connect.to("SCPDestination");

// Request the API using Axios Settings
let result = await service.run({
               url: "/pathOfService"
             })

```
## SCP Destination Configuration Examples



## Example Configure SCP Destination for Basic Authorization APIs
