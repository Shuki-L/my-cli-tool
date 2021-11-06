const getMenu = require("../../menus");
const { MENUS } = require("../../constants");
const { handleError } = require("../../utils");

const {
    SecretsManagerClient,
    ListSecretsCommand,
} = require("@aws-sdk/client-secrets-manager");

const showStatus = async (ctx) => {
    try {
        const config = {
            region: "us-east-1",
            credentials: {
                accessKeyId: "accessKeyId",
                secretAccessKey: "secretAccessKey",
            },
            endpoint: "http://localhost:4566",
        };
        // a client can be shared by different commands.
        const client = new SecretsManagerClient(config);
        const input = {
            // MaxResults: 10,
        };

        const command = new ListSecretsCommand(input);

        const response = await client.send(command);
        const secretList = response.SecretList;

        if (secretList.length === 0) {
            console.log("No secrets found");
        } else {
            for (let i = 0; i < secretList.length; i++) {
                console.log(
                    `${i + 1}: ${secretList[i].Name} (${
                        secretList[i].Description
                    })`
                );
            }
        }

        getMenu(MENUS.LOCALSTACK, ctx);
    } catch (error) {
        handleError(error);
    }
};

const secretsManager = { showStatus };

module.exports = secretsManager;
