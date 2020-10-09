const cds = require("@sap/cds");
const Destination = require('./src/destination.js')
const xsenv = require('@sap/xsenv')
const utils = require('./lib/scp-utils')
var fs = require('fs');

// function getJSONFile(filename) {
//     var parsedJSON;
//     try {
//         if (fs.existsSync(filename)) {
//             parsedJSON = JSON.parse(fs.readFileSync(filename, 'utf8'));
//         }
//         return parsedJSON;
//     } catch (err) {
//         throw new Error(err, 'Could not parse %s', filename);
//     }
// }

function to(cfDestination) {

    return new Promise(async (resolve, reject) => {
        let cfServiceName = 'destination'
        var destinations = []
        let ENV_JSON_FILE = './default-env.json'

        if (process.env.VCAP_SERVICES == null) {
            if (fs.existsSync(ENV_JSON_FILE)) {
                try {
                    var envJson = utils.getJSONFile(ENV_JSON_FILE);
                    process.env.VCAP_SERVICES = JSON.stringify(envJson.VCAP_SERVICES)
                } catch (err) {
                    console.error('Could not read configuration file ' + ENV_JSON_FILE + ': ' + err);
                }
            }
        }
        var cfServicesList = xsenv.readCFServices()
        
        const scpDestinations = new (require('./lib/scp-destinations.js'))()
        var destination = destinations.find(x => { return x.name == cfDestination })
        if (destination !== undefined && destination.length > 0) {
            return destination[0].value();
        }
        var scp_dest = await scpDestinations.readDestination(cfDestination);
        if (scp_dest.status != 200) {
            reject(new Error(`CDS-SCP-API: Missing destination configuration for ${cfDestination}!`));
        }
        destination = {}
        destination.name = cfDestination
        destination.value = new Destination(scp_dest.data.destinationConfiguration)
        destinations.push(destination)
        resolve(destination.value)
    });
}

module.exports = {
    connect: {
        to: to
    }
};