const lambda = require("./lambda.js");
const eventBridge = require("./eventbridge.js");
const sqs = require("./sqs.js");
const secretsManager = require("./secretsManager.js");

module.exports = {
    lambda,
    eventBridge,
    sqs,
    secretsManager,
};
