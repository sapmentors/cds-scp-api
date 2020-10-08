const cdsapi = require("@sapmentors/cds-scp-api");

// -----------------------------------------------------------------------------------------------------
// Calling Internet API with Basic Authentication using SCP Destinations to read products:
// HTTP method: GET 
// Destination settings
// - Name           : ES5
// - Proxy Type     : Internet
// - Authentication : BasicAuthentication
// -----------------------------------------------------------------------------------------------------
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

