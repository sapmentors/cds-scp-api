const axios = require('axios')
const oauth = require('axios-oauth-client')
const xsenv = require('@sap/xsenv')


class scpConnectivity {
    cfServiceName = 'connectivity'


    readConnectivity(locationId, principalToken) {
        var setConnectivityHeader = function(cfConnectivityInfo, token, locationId){
            const proxy = {
                host: cfConnectivityInfo.onpremise_proxy_host,
                port: parseInt(cfConnectivityInfo.onpremise_proxy_port, 10),
                protocol: 'http'
            };
            const result = {
                proxy,
                headers: {
                    'Proxy-Authorization': `${token.token_type} ${token.access_token}`
                }
            };
            if (locationId) {
                result.headers["SAP-Connectivity-SCC-Location_ID"] = locationId;
            }
            return result
        }
        return new Promise(async (resolve, reject) => {
            const cfConnectivityInfo = utils.getVCAPService(this.cfServiceName).cfServiceName
            if (principalToken)
            {
                utils.getTokenFromPrincipalForVCAPService(cfConnectivityInfo, principalToken)
                .then(token => {
                    resolve(setConnectivityHeader(cfConnectivityInfo, token, locationId))
                })
                .catch(error => {
                    console.log(error)
                    reject(error)
                })
            } else {
                utils.getTokenForVCAPService(cfConnectivityInfo)
                .then(token => {
                    resolve(setConnectivityHeader(cfConnectivityInfo, token, locationId))
                })
                .catch(error => {
                    console.log(error)
                    reject(error)
                })
           
            }
         })
    }
}

module.exports = scpConnectivity;