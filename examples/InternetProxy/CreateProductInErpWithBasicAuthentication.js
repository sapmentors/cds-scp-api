const cdsapi = require("@sapmentors/cds-scp-api");

// -----------------------------------------------------------------------------------------------------
// Calling Internet API with Basic Authentication using SCP Destinations to create a product:
// HTTP method: POST 
// Destination settings
// - Name           : ES5
// - Proxy Type     : Internet
// - Authentication : BasicAuthentication
// -----------------------------------------------------------------------------------------------------

	async function InternetAPIPostRequestwithBasicAuthorization(_product) {
		const service = await cdsapi.connect.to("ES5");
		return await service.run({
			url: "/sap/opu/odata/IWBEP/GWSAMPLE_BASIC/ProductSet",
			method: "post",
			headers: {
				'content-type': 'application/json'
			},
			data: _product,
			csrfProtection: true
		})
	}


	InternetAPIPostRequestwithBasicAuthorization(
		{
			"ProductID": "YourProductID",   //Please change this value before running
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
	)
	.then((resp) => {
		console.log('Post request')
		console.log(resp)
	}).catch(error => {
		console.log(error)
	})
