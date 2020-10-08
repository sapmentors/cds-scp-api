const cdsapi = require("@sapmentors/cds-scp-api");
const readFunction = async (req) => {
    let destination = 'MSGraph'
    var isOdataQuery = true;
    var $filter ="";
    var $top = "";
    var $skiptoken=""
    var userId = "";
    
    //Check if call is for entity or entityset
    if (req.params[0] !== undefined) {
        // Add OData capabilities for entity
        isOdataQuery = false;
        userId = req.params[0].aad_id;
    } else {
        // Add OData capabilities for entityset
        if (req._.odataReq._uriInfo._queryOptions.$filter !== undefined) {
            $filter = $req._.query.$filter
            $filter = $filter.replace("aad_id ", "id ");
            $filter = $filter.replace("username ", "userPrincipalName ");
            $filter = "$filter=" + filter
        }
        $top = req._.odataReq._uriInfo._queryOptions.$top !== undefined ? "$top=" + req._.query.$top : ""
        $skiptoken = req._.odataReq._uriInfo._queryOptions.$skiptoken !== undefined ? "$skiptoken=" + req._.query.$skiptoken : ""

    }

    //Create the url
    var sep1 = ($filter != "" && ($top != "" || skiptoken != "")) ? "&" : "";
    var sep2 = ($top != "" && ($skiptoken != "")) ? "&" : "";
    const url = `/v1.0/users/${userId}?${$filter}${sep1}${$top}${sep2}${$skiptoken}`

    //Call the API using CDS-SCP-API
    const service = await cdsapi.connect.to(destination);
    const graphUser = await service.run({
        url: url
    })

    //Handle the API result
    var users = {};
    if (isOdataQuery == false) {
        //Handle data for a entity
        users.aad_id = graphUser.id;
        users.username = graphUser.userPrincipalName;
        users.displayName = graphUser.displayName;
        users.givenName = graphUser.givenName;
        users.surname = graphUser.surname;
        users.isAzureActiveDirectory = true;
    } else {
        //Handle data for a entityset
        users = graphUser.value.map(graph_user => {
            var user = {};
            user.aad_id = graph_user.id;
            user.username = graph_user.userPrincipalName;
            user.displayName = graph_user.displayName;
            user.givenName = graph_user.givenName;
            user.surname = graph_user.surname;
            user.isAzureActiveDirectory = true;
            return user;
        });
    }
    return users;
}

module.exports = (srv) => {
    srv.on('READ', 'User', readFunction)
}