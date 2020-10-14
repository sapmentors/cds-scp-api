# CDS-SCP-API Node Module Examples

## Standalone Examples

These set up belongs to the [standalone node.js example](./readme.md). Please also follow the [SCP Destination Configuration](../README.md) as preparation to run the examples.

## Steps for setting up the standalone node.js example project

- Create a new folder and enter the new folder
  ```swift
  mkdir <example-folder>
  cd <example-folder>
  ```

- Create a new node project
  ```swift
  npm init -y
  ```

- Create a **test.js** file and copy the needed example javascript code as content in this file

- Add the following dependencies, just below the script settings to your **package.json** file 
  ```json
  "dependencies": {
    "@sapmentors/cds-scp-api": "^0.0.2-alpha"
  },
  ```

- install the node packages by running 
  ```swift
  npm install
  ```

- create a **default-env.json** file as described in the prerequisites 

- Replace the script settings in your **package.json** file with 
  ```json
  "scripts": {
    "start": "node test.js"
  },
  ```

- Run the test application with
  ```swift
  npm run start
  ```



## Prerequisite for running examples locally

Before you can run these examples locally, you need to add a **default-env.json** file with the and following minimum structure

```json
{ 
    "VCAP_SERVICES": {
        "destination": [
            {
                "label": "destination",
                "plan": "lite",
                "name": "destination",
                "instance_name": "<Destination-Service-Name>",
                "credentials": {
                    "clientid": "...",
                    "xsappname": "...",
                    "clientsecret": "...",
                    "url": "..."
                }
            }
        ]
    }
}
```
If you have the [Cloud Foundry Client Tools](https://developers.sap.com/tutorials/cp-cf-download-cli.html) installed, you can use them to find the settings.

- Credentials values can be retrieved with the statement:
  ```swift
  cf service-key <Destination-Service-Name> <Service-Key-Name>
  ```

- If you don't know the **Destination-Service-Name**, you can use the command:
  ```swift
  cf services 
  ```
  Look in the list below the ***service*** column for the destination, and you will find the **Destination-Service-Name** in the ***name*** column

- If you don't know the **Service-Key-Name**, you can use the command:
  ```swift
  cf service-keys <Destination-Service-Name>
  ```
  for available service keys

- If no **Service-Key-Name** exists, you can create one with the statement:
  ```swift
  cf create-service-key <Destination-Service-Name> <Service-Key-Name>
  ```

