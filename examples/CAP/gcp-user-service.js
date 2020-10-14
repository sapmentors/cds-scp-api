const cdsapi = require("@sapmentors/cds-scp-api");
const readFunction = async (req) => {
    console.log(req.user);

    var destination = 'GCP_API'
    const domain = '<your domain in google>'  
    const url = `/admin/directory/v1/users?domain=${domain}`
    const service = await cdsapi.connect.to(destination);
    console.log(service)
	const gcpUser = await service.run({
		url: url
	}).catch(error => {
        console.log(error)
    })

    let users = []
    users = gcpUser.users.map(gcpUser => {
        var user = {};
        user.gcp_id = gcpUser.id;
        user.username = gcpUser.primaryEmail;
        user.displayName = gcpUser.name.fullName;
        user.givenName = gcpUser.name.givenName;
        user.surname = gcpUser.name.familyName;
        user.isGoogleDirectory = true;
        return user;
    });
    return users;
};

module.exports = (srv) => {
    console.log(srv);
    srv.on('READ', 'User', readFunction);
};