const axios = require('axios')
const oauth = require('axios-oauth-client')
const xsenv = require('@sap/xsenv')




function getVCAPService(cfServiceName) {
    const cfServiceInfo = xsenv.getServices({
        cfServiceName: {
            label: cfServiceName
        }
    });
    if (!cfServiceInfo) {
        var error = {
            text: `No '${cfServiceName}' service found in SAP Cloud Platform project`
        }
        console.log(error.text)
        throw (error.text)
    }
    return cfServiceInfo
}

async function getTokenForVCAPService(cfServiceInfo) {
    return new Promise(async (resolve, reject) => {
        const getToken = oauth.client(axios.create(), {
            url: `${cfServiceInfo.url}/oauth/token`,
            grant_type: `client_credentials`,
            client_id: cfServiceInfo.clientid,
            client_secret: cfServiceInfo.clientsecret
        })

        getToken()
            .then(token => {
                resolve(token)
            })
            .catch(error => {
                console.log(error.text)
                reject(error)
            });
    })
}

async function getTokenFromPrincipalForVCAPService(cfServiceInfo, principalToken) {
    return new Promise(async (resolve, reject) => {
        const getRefreshToken = oauth.client(axios.create(), {
            url: `${cfServiceInfo.url}/oauth/token`,
            method: 'POST',
            responseType: 'json',
            params: {
                grant_type: `user_token`,
                response_type: 'token',
                client_id: cfServiceInfo.clientid,
            },
            headers: {
                'Accept': 'application/json',
                'Authorization': principalToken
            }
        })
        const getTokenFromRefreshToken = async function (refreshToken) {
            return oauth.client(axios.create(), {
                url: `${cfServiceInfo.url}/oauth/token`,
                method: 'POST',
                responseType: 'json',
                params: {
                    grant_type: 'refresh_token',
					refresh_token: refreshToken
                },
                headers: {
                    'Accept': 'application/json',
                },
                auth: {
                    username: cfServiceInfo.clientid,
                    password: cfServiceInfo.clientsecret
                }
            })
        }
        getRefreshToken()
            .then(resp => {
                getTokenFromRefreshToken(resp.data.refresh_token)
            })
            .then(resp => {
                resolve(resp.data.access_token)
            })
            .catch(error => {
                console.log(error.text)
                reject(error)
            });
    })
}

module.exports = {
    getVCAPService,
    getTokenForVCAPService,
    getTokenFromPrincipalForVCAPService
};