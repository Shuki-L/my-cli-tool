const execa = require("execa");
const getMenu = require("../../menus");
const { MENUS } = require("../../constants");
const { handleError } = require("../../utils");
const { SQSClient, ListQueuesCommand } = require("@aws-sdk/client-sqs");

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

        const client = new SQSClient(config);
        const input = {
            // MaxResults: 10,
        };

        const command = new ListQueuesCommand(input);
        const response = await client.send(command);
        const queues = response.QueueUrls;

        console.log(queues);

        getMenu(MENUS.LOCALSTACK, ctx);
    } catch (error) {
        handleError(error);
    }
};

const sqs = { showStatus };

module.exports = sqs;

// awslocal sqs list-queues
// awslocal sqs send-message --message-body <message-body> --queue-url "http://localstack:4576/queue/q-my-queue"
// awslocal sqs receive-message --queue-url "http://localstack:4576/queue/q-my-queue"
