const cdsapi = require("@sapmentors/cds-scp-api");

// -----------------------------------------------------------------------------------------------------
// Calling Internet API with SCP Destination:
// HTTP method: GET 
// Destination settings:
// - Name           : Northwind
// - Proxy Type     : Internet
// - Authentication : NoAuthentication
// -----------------------------------------------------------------------------------------------------
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