const { ACTIONS, MENUS } = require("../constants");
const getMenu = require("../menus");
const {
    lambda,
    eventBridge,
    sqs,
    secretsManager,
} = require("../actions/localstack");
const { quit } = require("./common");
const chalk = require("chalk");

const performAction = async (answers, ctx) => {
    if (typeof answers.choice === "function") {
        answers.choice(ctx);
    } else {
        switch (answers.choice) {
            case ACTIONS.LOCALSTACK_GET_MENU:
                getMenu(MENUS.LOCALSTACK, ctx);
                break;
            case ACTIONS.LOCALSTACK_LAMBDAS_GET_LIST:
                await lambda.listFunctions(ctx);
                // getMenu(MENUS.LOCALSTACK, ctx);
                break;
            case ACTIONS.LOCALSTACK_LAMBDAS_GET_LOGS:
                await lambda.getLogs(ctx); //TODO : handle error or get list and generate menu
                //   probably need to set some params in ctx - not a menu or leaf

                // getMenu(MENUS.LOCALSTACK, ctx);
                break;
            case ACTIONS.LOCALSTACK_EVENT_BRIDGE_STATUS:
                await eventBridge.showStatus(ctx);
                break;
            case ACTIONS.LOCALSTACK_SQS_STATUS:
                await sqs.showStatus(ctx);
                break;
            case ACTIONS.LOCALSTACK_SECRETS_MANAGER:
                await secretsManager.showStatus(ctx);
                break;
            case ACTIONS.GO_BACK:
                getMenu(ctx.previousMenu, ctx);
                break;
            case ACTIONS.GET_MAIN_MENU:
                getMenu(MENUS.MAIN, ctx);
                break;
            case ACTIONS.SENT_FEEDBACK:
                console.log(
                    chalk.yellow.bold(
                        "For feature requests, bug report or any other feedback, please raise an issue at:"
                    )
                );
                console.log(
                    chalk.yellow.bold.italic(
                        "https://github.com/Shuki-L/my-cli-tool/issues/new/choose" +
                        chalk.gray("   (<-- CMD+click to open the link)")
                    )
                );
                getMenu(MENUS.MAIN, ctx);
                break;
            case ACTIONS.QUIT:
                quit();
                break;
            default:
                break;
        }
    }
};

module.exports = performAction;
