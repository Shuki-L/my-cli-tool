const { MENUS, ACTIONS } = require("../constants");

const github = {
    [MENUS.GITHUB]: {
        items: [
            {
                name: "Get App Installations ⭐️ New ⭐️",
                value: ACTIONS.GITHUB_APP_GET_INSTALLATIONS,
                short: "App installations",
            }
        ],
    },
};

module.exports = github;
