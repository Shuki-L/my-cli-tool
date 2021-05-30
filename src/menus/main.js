const { MENUS, ACTIONS } = require("../constants");

const main = {
    [MENUS.MAIN]: {
        items: [
            {
                name: "Query localstack",
                value: ACTIONS.LOCALSTACK_GET_MENU,
                short: "Query localstack",
            },
        ],
        meta: {
            isMain: true,
        },
    },
};

module.exports = main;
