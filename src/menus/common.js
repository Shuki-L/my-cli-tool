const { ACTIONS } = require("../constants");

const getCommonMenu = (ctx) => {
    return [
        ...(!ctx.isMainMenu && ctx.previousMenu
            ? [{ name: "🔙 Go back", value: ACTIONS.GO_BACK, short: "Go back" }]
            : []),
        ...(!ctx.isMainMenu && ctx.previousMenu !== ctx.mainMenu
            ? [
                  {
                      name: "🎬 Main menu",
                      value: ACTIONS.GET_MAIN_MENU,
                      short: "Main menu",
                  },
              ]
            : []),
        ...[{ name: "👻 Send feedback", value: ACTIONS.SENT_FEEDBACK, short: "Feedback" }],
        ...[{ name: "🚪 Quit", value: ACTIONS.QUIT, short: "Bye Bye" }],
    ];
};

module.exports = { getCommonMenu };
