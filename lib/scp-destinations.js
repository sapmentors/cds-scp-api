const axios = require('axios')
const oauth = require('axios-oauth-client')
const xsenv = require('@sap/xsenv')
const utils = require('./scp-utils')
const cfServiceName = 'destination'

class scpDestinations {


    readDestination(cfDestinationName) {
        return new Promise(async (resolve, reject) => {
            const cfDestinationInfo = utils.getVCAPService(cfServiceName).cfServiceName
            utils.getTokenForVCAPService(cfDestinationInfo)
 //           this.getTokenForDestinationService(cfDestinationInfo)
                .then(token => {
                    return axios.get(
                        `${cfDestinationInfo.uri}/destination-configuration/v1/destinations/${cfDestinationName}`, {
                        headers: {
                            'Authorization': `${token.token_type} ${token.access_token}`
                        },
                        responseType: 'json'
                    })
                })
                .then(destination => {
                    resolve(destination)
                })
                .catch(error => {
                    console.log(error)
                    reject(error)
                })
        })
    }

    async readDestinationAsync(cfDestinationName) {
        return await readDestination(cfDestinationName)
    }

    readSubAccountDestinationList() {
        return new Promise(async (resolve, reject) => {
            const cfDestinationInfo = utils.getVCAPService(cfServiceName).cfServiceName
            //            this.getTokenForDestinationService(cfDestinationInfo)
            utils.getTokenForVCAPService(cfDestinationInfo)
                .then(token => {
                    axios.get(
                        `${cfDestinationInfo.uri}/destination-configuration/v1/subaccountDestinations`, {
                        headers: {
                            'Authorization': `${token.token_type} ${token.access_token}`
                        },
                        responseType: 'json'
                    })
                        .then(destinationList => {
                            resolve(destinationList)
                        })
                        .catch(error => {
                            console.log(error)
                            reject(error)
                        })
                })
        })
    }

    async readSubAccountDestinationListAsync() {
        return await readSubAccountDestinationList()
    }




    getTokenForDestinationService(cfDestinationInfo) {
        return new Promise(async (resolve, reject) => {
            const getToken = oauth.client(axios.create(), {
                url: `${cfDestinationInfo.url}/oauth/token`,
                grant_type: `client_credentials`,
                client_id: cfDestinationInfo.clientid,
                client_secret: cfDestinationInfo.clientsecret
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

    async getTokenForDestinationServiceAsync(cfDestinationInfo) {
        return await getTokenForDestinationService(cfDestinationInfo)
    }



}

module.exports = scpDestinations;