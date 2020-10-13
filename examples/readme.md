# CDS-SCP-API Node Module Examples

## Standalone Examples

These code examples only provides the executable code for the scenario. Please look at the [steps for setting up the standalone example project](./standalonesetup.md) and  [SCP Destination Configuration](../README.md) as preparation to run the examples.

- [Retrieve a product list from public available OData Service called Northwind](./InternetProxy/ReadPublicApiNorthwindWithNoAuthentication.js) - No Authentification
- [Retrieve a product list from public available SAP OData service](./InternetProxy/ReadProductsOfErpWithBasicAuthentication.js) - Basic Authentification
- [Create a product with public available SAP OData service](./InternetProxy/CreateProductInErpWithBasicAuthentication.js)  - Basic Authentification
- [Read user list from Microsoft Azure Active Directory](./InternetProxy/ReadUserlistOfAzureActiveDirectoryWithClientCredentialsAuthentication.js) - Client Credentials  Authentification
- Read user list from Google Cloud Platform - JWT Token Authentification (under construction)

## Cloud Application Programming Model Examples
To run these examples. you also need to setup the [SCP Destination Configuration](../README.md) as preparation.

- [User list from Microsoft Azure Active Directory as CAP CDS External Service](./CAP/CapMSGraphCdsService.md)
- User list from Google Cloud Platform as CAP CDS External Service (under construction)
- Create Excel in Office365 from CAP CDS action - (under construction)

