const cdsapi = require("@sapmentors/cds-scp-api");

// -----------------------------------------------------------------------------------------------------
// Calling Internet API with Client Credentials using SCP Destinations to create a product:
// HTTP method: GET 
// Destination settings
// - Name           : MicrosoftGraph
// - Proxy Type     : Internet
// - Authentication : OAuth2ClientCredentials
// For configuration see documentation
// -----------------------------------------------------------------------------------------------------
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
