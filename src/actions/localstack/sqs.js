const execa = require("execa");
const getMenu = require("../../menus");
const { MENUS } = require("../../constants");
const { handleError } = require("../../utils");

const showStatus = async (ctx) => {
    try {
        const sqsList = await execa("awslocal", ["sqs", "list-queues"]);

        const sqsQueues = JSON.parse(sqsList.stdout).QueueUrls;
        console.log(sqsQueues);

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
