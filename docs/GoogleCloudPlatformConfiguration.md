# API configuration in Google Cloud Platform

You will find the information to configure Google APIs in Google Cloud Platform for the node module examples on this page.

## Google Developer Portal 
1. Access the Google Developer Portal by starting the URL https://console.developers.google.com/ in your browser

   ![Google Developer Portal](./pictures/PortalGoogleDeveloperWelcomePage.png)

2. Create a new project by clicking [CREATE PROJECT] and give the project a name, click save and the project space is created

   ![Google Developer Portal](./pictures/GoogleApiNewProject.png)

   ![Google Developer Portal](./pictures/GoogleApiProjectCreated.png)

3. Next, we click on [+ ENABLE APIS AND SERVICES] to activate the Google API setup

   ![Google Developer Portal](./pictures/GoogleApiEnableAPI.png)

## Google API setup 

4. It opens the API library from Google

   ![Google Developer Portal](./pictures/GoogleApiLibrary.png)
 
5. We want to access the API for [reading all users' full profiles](https://developers.google.com/admin-sdk/directory/v1/reference). This API is available in the Admin SDK. So we search for this API package and click it on the list.

   ![Google Developer Portal](./pictures/GoogleApiLibrarySearch.png)

6. It opens the page with more information about the API package **Admin SDK**. We click the [ENABLE] button to activate the API.

   ![Google Developer Portal](./pictures/GoogleApiAdminSDKOverview.png)

## Enable API credentials 
7. The configuration page **Admin SDK** shows up, and we click [CREATE CREDENTIALS] to start the API credentials setup process.

   ![Google Developer Portal](./pictures/GoogleApiAdminSDKSettings.png)

8. The **Add credentials to your project pages** open 

   ![Google Developer Portal](./pictures/GoogleApiProjectCredentials.png)

9. We choose **Admin SDK** as the API we want to use and select **No, I'm not using them** for running the API with Google App or Compute Engine. 

   ![Google Developer Portal](./pictures/GoogleApiAdminUsedAPI.png)

## Service Account 
10. Next, I click [What credentials do I need?] button, which lets me fill in the **service account** settings.

    ![Google Developer Portal](./pictures/GoogleApiAddServiceAccount.png)

11. We give the **service account** a name and choose the **Owner** for the role and JSON for the key type.

    ![Google Developer Portal](./pictures/GoogleApiAddServiceAccountSettings.png)

12. When we click [Continue], the **service account** and a private key is created. A private key JSON file will be downloaded (see blue arrow). The content of this file is needed as **Client Secret** in the SAP Cloud Platform for the Google Destination. 

    ![Google Developer Portal](./pictures/GoogleApiAddServiceAccountPrivateKey.png)

    ```text
    Client Secret          : <content of google service account private key JSON file>
    ```

    In the content of the file, you will also find the Token Service URL

    ```text
    Token Service URL      : https://oauth2.googleapis.com/token
    ```

13. When we close the popup, we are back to the **Credentials Overview** screen. We will ignore the warning and choose [Manage service accounts] link to set the service account's authorizations.

    ![Google Developer Portal](./pictures/GoogleApiCredentialsOverview.png)

14. It opens the **Service Account Overview** page, and we choose Edit by clicking the three dots. 

    ![Google Developer Portal](./pictures/GoogleApiServiceAccountEdit.png)

15. It shows the **Service Account Details** page. 

    ![Google Developer Portal](./pictures/GoogleApiServiceAccountDetails.png)    

16. Click the link **[SHOW DOMAIN-WIDE DELEGATION]** on the page and mark the **Enable G Suite Domain-wide Delegation** checkbox and give the product a name for the consent screen and click the [SAVE] button on the bottom of the page. 

    ![Google Developer Portal](./pictures/GoogleApiDomainWideDelegationSettings.png)  

17. After we saved the page, we navigate to the **Credentials Overview** page by clicking the hamburger menu(1), choose APIs & Services (2), and click Credentials (3).

    ![Google Developer Portal](./pictures/GoogleApiNavigateCredentials.png)  

18. On the **Credentials Overview** page, the warnings are gone, and we will find our Client ID in the middle of the page

    ![Google Developer Portal](./pictures/GoogleApiCredentialsOverviewClientId.png)  

    ```text
    Client ID              : <OAuth 2.0 Client ID of the Google Service API Credential page>
    ```

## Setup authorization for domain-wide delegation 

19. We are almost ready to set up the Google APIs. We only need to set up the authorization of the domain-wide delegation. For this, we will open the administration console on https://admin.google.com  

    ![Google Developer Portal](./pictures/GoogleAdminConsole.png)  

20. On the console, we click the Security tile. It will open the **Security Settings Overview** page  

    ![Google Developer Portal](./pictures/GoogleAdminSecuritySettings.png)  

21. On the **Security Settings Overview** page, we scroll down and choose **API controls** 

    ![Google Developer Portal](./pictures/GoogleAdminApiControls.png)  

22. On the **API controls Overview** page, we choose **[MANAGE DOMAINWIDE DELEGATION]** 

    ![Google Developer Portal](./pictures/GoogleAdminApiDomainWideDelegationOverview.png)  

23. We click **Add new** to configure a new API client. We need our **Client Id** from step 18 and need to add the OAuth scopes for the API.  You will find the available scopes in the [API documentation](https://developers.google.com/admin-sdk/directory/v1/guides/manage-users). In this case, the scope **https://www.googleapis.com/auth/admin.directory.user.readonly** is advised to retrieve a user's public profile.

    ![Google Developer Portal](./pictures/GoogleAdminApiDomainWideDelegationNewClient.png)      

    ```text
    Client ID              : <OAuth 2.0 Client ID of the Google Service API Credential page>
    OAuth scopes           : https://www.googleapis.com/auth/admin.directory.user.readonly
    ```

    We will use this scope also in our Google Destination in the SAP Cloud Platform.

    ```text
    jwt.scopes             : https://www.googleapis.com/auth/admin.directory.user.readonly
    ```

24. After we click **[AUTHORIZE]**, we are ready with the API settings on the Google Cloud Platform 

    ![Google Developer Portal](./pictures/GoogleAdminApiDomainWideDelegationClientOverview.png)

## Google Destinations in SAP Cloud Platform 

25. The last step is setting up the Google Destinations in SAP Cloud Platform 
 
    ![Destination Configuration](./pictures/DestinationInternetForGoogleCloudPlatform.png)

    ```text
    URL                    : https://www.googleapis.com
    Client ID              : <OAuth 2.0 Client ID of the Google Service API Credential page>
    Client Secret          : <content of google service account private key JSON file>
    Token Service URL      : https://oauth2.googleapis.com/token
    jwt.scope              : https://www.googleapis.com/auth/admin.directory.user
    jwt.sub                : <A delegated email address of the Google Suite>
    jwts.expiration-time   : 3600
    jwts.signing-algorithm : RS256
    jwts.type              : gcp_service_account
    ```

    Remark:
    - **jwts** are the JSON Web Token Settings for the CDS-SCP-API implementation. At this moment, only jwts.type **gcp_service_account** is supported.
    - **jwt** are the JSON Web Token Claims, which can be found [here](https://www.iana.org/assignments/jwt/jwt.xhtml) and added as SAP Cloud Platform destination additional properties.
    - The CDS-SCP-API implementation for jwts.type **gcp_service_account** will set the JWT claim values for **iss** and **aud** from the Client Secret, use the current time for the JWT claim **iat**, and add the jwts.expiration-time to the current time as value for the JWT claim **exp**.

