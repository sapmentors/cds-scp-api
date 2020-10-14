const cdsapi = require("@sapmentors/cds-scp-api");

// -----------------------------------------------------------------------------------------------------
// Calling Internet API with Client Credentials using SCP Destinations to collect user data:
// HTTP method: GET 
// Destination settings
// - Name           : GCP_API
// - Proxy Type     : Internet
// - Authentication : OAuth2JWTBearer
// For configuration see documentation
// -----------------------------------------------------------------------------------------------------
async function InternetAPIGetRequestforGoogleCloudPlatform() {
	const service = await cdsapi.connect.to("GCP_API");
	const domain = '<your_domain>'
	const url = `/admin/directory/v1/users?domain=${domain}`
	return await service.run({
		url: url
	})
}

InternetAPIGetRequestforGoogleCloudPlatform()
	.then((data) => {
		console.log(data.users[0].name.fullName)
	})
