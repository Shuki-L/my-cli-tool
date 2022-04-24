const { MENUS, ACTIONS } = require("../constants");

const localstack = {
    [MENUS.LOCALSTACK]: {
        items: [
            {
                name: "Get Lambda logs",
                value: ACTIONS.LOCALSTACK_LAMBDAS_GET_LOGS,
                short: "Lambda logs",
            },
            {
                name: "List Lambdas",
                value: ACTIONS.LOCALSTACK_LAMBDAS_GET_LIST,
                short: "List of lambdas",
            },            
            {
                name: "Event Bridge status",
                value: ACTIONS.LOCALSTACK_EVENT_BRIDGE_STATUS,
                short: "Event Bridge status",
            },
            {
                name: "SQS status",
                value: ACTIONS.LOCALSTACK_SQS_STATUS,
                short: "SQS status",
            },
            {
                name: "Secret Manager 🤫",
                value: ACTIONS.LOCALSTACK_SECRETS_MANAGER,
                short: "Secret Manager",
            },
        ],
    },
};

module.exports = localstack;
