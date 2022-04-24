const { MENUS, ACTIONS } = require("../constants");

const main = {
    [MENUS.MAIN]: {
        items: [
            {
                name: "Query localstack",
                value: ACTIONS.LOCALSTACK_GET_MENU,
                short: "Query localstack",
            },
            {
                name: "Github Actions",
                value: ACTIONS.GITHUB_ACTIONS_MENU,
                short: "Query localstack",
            },
        ],
        meta: {
            isMain: true,
        },
    },
};

module.exports = main;
