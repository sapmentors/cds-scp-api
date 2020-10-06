const _ = require("lodash");
const axios = require("axios").default;
const MockAdapter = require("axios-mock-adapter");
const assert = require("assert").strict;
const mock = new MockAdapter(axios);
const cdsapi = require("../index");
const { resolve } = require("path");
const { reject } = require("lodash");


describe("Class Destination", () => {

    describe("Connection to Destination with No Authentication", () => {

        var url = 'https://destination-configuration.cfapps.eu10.hana.ondemand.com/destination-configuration/v1/destinations/BlaBla'
        mock.onGet(url).reply(200, require("./data/Destination_NoAuthentication-GET-200"));

        url = 'https://docloudnow.authentication.eu10.hana.ondemand.com/oauth/token'
        mock.onPost(url).reply(200, require("./data/OAut_Token-GET-200"));

        url = 'https://www.nl4b.com/'
        mock.onGet(url).reply(200, require("./data/API_NL4B-GET-200"));

        it("- check cdsapi.connect.to", (done) => {
            cdsapi.connect.to("BlaBla")
                .then(service => {
                    assert.strictEqual(service.destinationConfiguration.Name, 'BlaBla', `Destination name is incorrect `);
                    assert.strictEqual(service.destinationConfiguration.Authentication, 'NoAuthentication', `Destination authentication is not NoAuthentication`);
                    done();
                }).catch(error => {
                    done(error);
                })
        });
        it("- check service.run", (done) => {
            cdsapi.connect.to("BlaBla")
                .then(service => {
                    service.run({
                        url: "/",
                        header: {
                            'content-type': 'text/text'
                        },
                        transformResponse: ((data) => {
                            return data
                        })
                    })
                    .then(data => {
                        assert.strictEqual(data.website, 'nl4b.com');
                        assert.strictEqual(data.status, 200);
                        done();
                    })
                    .catch(error => {
                        done(error);
                    })
                }).catch(error => {
                    done(error)
                })
        })
    });
});
