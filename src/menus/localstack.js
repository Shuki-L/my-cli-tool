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
        ],
    },
};

module.exports = localstack;
