//const scpDestinations = require('../lib/scp-destinations.js')
const scpConnectivity = require('../lib/scp-connectivity.js')
const axios = require('axios')
const oauth = require('axios-oauth-client')

function getClientCredentialsTokenForDestination(cfDestinationInfo) {
    return new Promise((resolve, reject) => {
        var cfg = {}
        cfg['url'] = cfDestinationInfo.tokenServiceURL
        cfg['grant_type'] = `client_credentials`
        cfg['client_id'] = cfDestinationInfo.clientId
        cfg['client_secret'] = cfDestinationInfo.clientSecret
        if (cfDestinationInfo.scope !== undefined) {
            cfg['scope'] = cfDestinationInfo.scope
        }
        const getClientCredentials = oauth.client(axios.create(), cfg)
        getClientCredentials()
            .then(token => {
                resolve(token);
            })
            .catch(error => {
                if (process.env.DEBUG === "true") {
                    console.error(error.message);
                    console.error(error.response.data);
                }
                reject(error)
            });
    })
}

function getAuthorizationHeader(_config, cfDestinationInfo) {
    return new Promise((resolve, reject) => {
        var error;
        var config = Object.assign({}, _config);
        config.headers = config.headers || {};
        switch (cfDestinationInfo.Authentication) {
            case "NoAuthentication":
                resolve(config)
                break;
            case "BasicAuthentication":
                const username = cfDestinationInfo.User
                const password = cfDestinationInfo.Password
                const basic_token = Buffer.from(`${username}:${password}`, 'utf8').toString('base64')
                config.headers['Authorization'] = `Basic ${basic_token}`
                resolve(config)
                break;
            case "OAuth2ClientCredentials":
                getClientCredentialsTokenForDestination(cfDestinationInfo).then(clientCredentialsToken => {
                    config.headers['Authorization'] = `${clientCredentialsToken.token_type} ${clientCredentialsToken.access_token}`
                    resolve(config)
                }).catch(error => {
                    if (process.env.DEBUG === "true") {
                        console.error('Error in getAuthorizationHeader (destination.js) \n');
                        console.error(error.message);
                        console.error(error.response.data);
                    }
                    reject(error)
                });
                break;
            case "OAuth2JWTBearer":
                if (cfDestinationInfo["jwts.type"] !== undefined) {
                    switch (cfDestinationInfo["jwts.type"]) {
                        case 'gcp_service_account':
                            createJwtTokenForGCPServiceAccount(cfDestinationInfo)
                                .then((tokenResp) => {
                                    var params = {
                                        grant_type: `urn:ietf:params:oauth:grant-type:jwt-bearer`,
                                        assertion: tokenResp.jwtToken
                                    }
                                    return axios.post(
                                        tokenResp.tokenURI,
                                        params
                                    )
                                })
                                .then(resp => {
                                    config.headers['Authorization'] = `${resp.data.token_type} ${resp.data.access_token}`
                                    resolve(config)
                                    console.log(resp)
                                })
                                .catch(error => {
                                    if (process.env.DEBUG === "true") {
                                        console.error('Error in getAuthorizationHeader:OAuth2JWTBearer (destination.js) \n');
                                        console.error(error.message);
                                        console.error(error.response.data);
                                    }
                                    reject(error)
                                })
                            break;
                        default:
                            error = new Error(`CDS-SCP-API: Authentication Type OAuth2JWTBearer is only supported for gcp_service_account!`);
                            if (process.env.DEBUG === "true") {
                                console.error('Error in getAuthorizationHeader (destination.js) \n');
                                console.error(error.message);
                            }
                            reject(error)
                    }
                } else {
                    error = new Error(`CDS-SCP-API: Authentication Type OAuth2JWTBearer is only supported for gcp_service_account!`);
                    if (process.env.DEBUG === "true") {
                        console.error('Error in getAuthorizationHeader (destination.js) \n');
                        console.error(error.message);
                    }
                    reject(error)
                }
                break;
            default:
                error = new Error(`CDS-SCP-API: Authentication ${cfDestinationInfo.Authentication} is not supported!`)
                if (process.env.DEBUG === "true") {
                    console.error('Error in getAuthorizationHeader (destination.js) \n');
                    console.error(error.message);
                }
                reject(error)
        }
    })
}

function createJwtTokenForGCPServiceAccount(cfDestinationInfo) {
    return new Promise((resolve, reject) => {
        var error;
        var serviceAccount;
        var expiration = 3600
        var signingAlgorithm = 'RS256'
        try {
            serviceAccount = JSON.parse(cfDestinationInfo["clientSecret"]);
        } catch (error) {
            error = new Error(`CDS-SCP-API: Client Secret isn't a Google Cloud Platfrom Service Account json file`)
            if (process.env.DEBUG === "true") {
                console.error('Error in createJwtTokenForGCPServiceAccount (destination.js) \n');
                console.error(error.message);
            }
            reject(error);
        }
        if (cfDestinationInfo['jwts.expiration-time']) {
            let et = Number(cfDestinationInfo['jwts.expiration-time']);
            if (!Number.isNaN(et) && Number.isInteger(et)) {
                if (et < 0) {
                    error = new Error(`CDS-SCP-API: property jwts.expiration-time cannot be negative`)
                    if (process.env.DEBUG === "true") {
                        console.error('Error in createJwtTokenForGCPServiceAccount (destination.js) \n');
                        console.error(error.message);
                    }
                    reject(error);
                }
                expiration = et;
            } else {
                error = new Error(`CDS-SCP-API: property jwts.expiration-time is not a integer`)
                if (process.env.DEBUG === "true") {
                    console.error('Error in createJwtTokenForGCPServiceAccount (destination.js) \n');
                    console.error(error.message);
                }
                reject(error);
            }
        }

        if (cfDestinationInfo['jwts.signing-algorithm']) {
            signingAlgorithm = cfDestinationInfo['jwts.signing-algorithm'];
        }

        var jwtClaims = {}
        jwtClaimKeys = Object.keys(cfDestinationInfo).filter(x => { return x.startsWith('jwt.') })
        for (let i = 0; i < jwtClaimKeys.length; i++) {
            jwtClaims[jwtClaimKeys[i].slice(4)] = cfDestinationInfo[jwtClaimKeys[i]];
        }

        let issuedAt = Math.floor(Date.now() / 1000);
        jwtClaims['iat'] = issuedAt
        jwtClaims['exp'] = issuedAt + expiration
        jwtClaims['iss'] = serviceAccount.client_email
        jwtClaims['aud'] = serviceAccount.token_uri

        const jwt = require('jsonwebtoken');
        try {
            const issueJWT = (jwtClaims, serviceAccount) =>
                jwt.sign(
                    jwtClaims,
                    serviceAccount.private_key,
                    {
                        algorithm: signingAlgorithm,
                        header: {
                            'kid': serviceAccount.private_key_id,
                            'typ': 'JWT',
                            'alg': signingAlgorithm,
                        },
                    }
                );
            resolve({ 'jwtToken': issueJWT(jwtClaims, serviceAccount), 'tokenURI': serviceAccount.token_uri });
        } catch (error) {
            if (process.env.DEBUG === "true") {
                console.error('Error in createJwtTokenForGCPServiceAccount (destination.js) \n');
                console.error(error.message);
            }
            reject(error)
        }
    });
}

function getAxiosConfig(options, cfDestinationInfo, connectivity) {
    return new Promise((resolve, reject) => {
        var config = Object.assign({}, options);
        config.headers = Object.assign({}, options.headers);

        //Delete Axios Option properties which will be set by the destination service
        delete config['baseURL'];
        delete config.headers['Authorization'];

        //Set BaseURL from destination service
        config.baseURL = cfDestinationInfo.URL;

        //Set Authorization from destination service
        getAuthorizationHeader(config, cfDestinationInfo)
            .then(config => {
                //Set Proxy setting from connectivity service for OnPremise destinations
                //<ore info https://blogs.sap.com/2020/08/07/sap-cloud-platform-how-to-call-onprem-system-from-node.js-app-via-cloud-connector/
                if (connectivity) {
//                    config.proxyConfiguration = Object.assign({}, connectivity.proxy)
                    config.proxy = Object.assign({}, connectivity.proxy)
                    config.headers = Object.assign(config.headers || {}, connectivity.headers)

                }

                // if (connectivity) {

                //     var agent = tunnel.httpsOverHttp({
                //         proxy: {
                //           host: connectivity.proxy.host,
                //           port: connectivity.proxy.port,
                //           headers : Object.assign({}, connectivity.headers)
                //         }
                //       });
                //     config.agent = agent
                //     config.proxy = false
    
                //     //config.proxy = connectivity.proxy
                //     //config.headers = Object.assign(config.headers || {}, connectivity.headers)
                // }


                //Set csrf token when requested
                if (config.csrfProtection) {
                    axios(getConfigForTokenFetch(config))
                        .then(resp => {
                            const { headers } = resp;
                            config.headers = config.headers || {};
                            config.headers["x-csrf-token"] = headers["x-csrf-token"];
                            const cookies = headers["set-cookie"];
                            if (cookies) {
                                config.headers.Cookie = cookies.join("; ");
                            }
                            resolve(config);
                        })
                        .catch(error => {
                            reject(error)
                        });

                } else {
                    resolve(config);
                }
            })
            .catch(error => {
                reject(error)
            });
    });
}


class destinations {
    constructor(destinationConfiguration) {
        if (destinationConfiguration.URL === undefined) {
            throw new Error(`CDS-SCP-API: Url is not defined!`);
        }
        if (destinationConfiguration.Authentication !== "NoAuthentication"
            && destinationConfiguration.Authentication !== "BasicAuthentication"
            && destinationConfiguration.Authentication !== "OAuth2JWTBearer"
            && destinationConfiguration.Authentication !== "OAuth2ClientCredentials") {
            throw new Error(`CDS-SCP-API: Authentication Type ${destinationConfiguration.Authentication} is not supported!`);
        }
        this.destinationConfiguration = destinationConfiguration;
    }

    run(options) {
        return new Promise((resolve, reject) => {
            const locationId = (this.destinationConfiguration.CloudConnectorLocationId) ? this.destinationConfiguration.CloudConnectorLocationId : null;
            switch (this.destinationConfiguration.ProxyType) {
                case "OnPremise":
                    var connectivityConfig = new scpConnectivity().readConnectivity(locationId)
                        .then(connectivityConfig => {
                            return getAxiosConfig(options, this.destinationConfiguration, connectivityConfig)
                        })
                        .then(axiosConfig => {
                            return axios(axiosConfig)
                        })
                        .then(response => {
                            if (process.env.DEBUG === "true") {
                                console.log(response.data);
                            }
                            resolve(response.data);
                        })
                        .catch(error => {
                            if (process.env.DEBUG === "true") {
                                console.error(error.message);
                                console.error(error.response.data);
                            }
                            reject(error);
                        });
                        break;
                case "Internet":
                    switch (this.destinationConfiguration.Type) {
                        case "HTTP":
                            getAxiosConfig(options, this.destinationConfiguration)
                                .then(axiosConfig => {
                                    return axios(axiosConfig);
                                })
                                .then(results => {
                                    if (process.env.DEBUG === "true") {
                                        console.log(results.data);
                                    }
                                    resolve(results.data);
                                })
                                .catch(error => {
                                    if (process.env.DEBUG === "true") {
                                        console.error(error.message);
                                        console.error(error.response.data);
                                    }
                                    reject(error);
                                });
                            break;
                        default:
                            reject(new Error(`CDS-SCP-API: Type ${this.destinationConfiguration.Type} is not supported!`));
                    }
                    break;
                default:
                    reject(new Error(`CDS-SCP-API: Proxy Type ${this.destinationConfiguration.ProxyType} is not supported!`));
            }
        });
    }
}

module.exports = destinations;