const execa = require("execa");
const chalk = require("chalk");
const getMenu = require("../../menus");
const { ACTIONS, MENUS } = require("../../constants");
const { toTime } = require("../../utils");

const _handleError = (error) => {
    if (error.exitCode) {
        switch (error.exitCode) {
            case 255:
                console.log(
                    chalk.red.bold(
                        "ERROR: make shure you have localstack up and running"
                    )
                );
                break; // TODO: add verbose mode

            default:
                console.log(error);
                break;
        }
    } else {
        console.log(error);
    }
};

const listFunctions = async (ctx) => {
    try {
        const { stdout } = await execa("awslocal", [
            "lambda",
            "list-functions",
        ]);

        const functions = JSON.parse(stdout).Functions;

        const items = functions.map((func) => {
            return {
                name: `${func.FunctionName} (${func.Description})`,
                value: (ctx) => {
                    const funcCopy = { ...func };
                    const log = () => {
                        console.dir(funcCopy); // TODO: wrap with a nice box
                        getMenu(MENUS.LOCALSTACK, ctx);
                    };
                    log();
                },
                short: `${func.FunctionName}`,
            };
        });
        if (items.length > 0) {
            const customMenu = {
                [ACTIONS.LOCALSTACK_LAMBDA_GET_DETAILS]: {
                    items: items,
                    meta: {
                        isCustom: true,
                    },
                },
            };
            ctx.menuMessage = "Select lambda to show more details";
            getMenu(ACTIONS.LOCALSTACK_LAMBDA_GET_DETAILS, ctx, customMenu);
        } else {
            console.log(chalk.yellow.bold("No results found"));
            getMenu(MENUS.LOCALSTACK, ctx);
        }
    } catch (error) {
        _handleError(error);
    }
};

const _buildGroupsMenu = (ctx, logGroups) => {
    if (logGroups.length > 0) {
        const items = logGroups.map((g) => {
            const groupName = g.logGroupName.split("/").pop();
            return {
                name: `${groupName} (${toTime(g.creationTime)})`,
                value: (ctx) => {
                    const groupCopy = { ...g };
                    const getStreams = () => {
                        _getStreams(ctx, groupCopy.logGroupName);
                    };
                    getStreams();
                },
                short: `${groupName}`,
            };
        });

        const customMenu = {
            [MENUS.LOCALSTACK_LAMBDAS_LOGS_GROUPS]: {
                items: items,
                meta: {
                    isCustom: true,
                },
            },
        };
        ctx.menuMessage = "Select log group";
        getMenu(MENUS.LOCALSTACK_LAMBDAS_LOGS_GROUPS, ctx, customMenu);
    } else {
        console.log(chalk.yellow.bold("No logs found"));
        getMenu(MENUS.LOCALSTACK, ctx);
    }
};

const _buildStreamsMenu = (ctx, logStreams, logGroupName) => {
    if (logStreams.length > 0) {
        const items = logStreams.map((s, i) => {
            const streamName = `${i + 1}) ${toTime(s.creationTime)}`;
            return {
                name: streamName,
                value: (ctx) => {
                    const streamCopy = { ...s };
                    const getStream = async () => {
                        logEvents = await _getStreamEvents(
                            logGroupName,
                            streamCopy.logStreamName
                        );
                        console.dir(logEvents);
                        getMenu(MENUS.LOCALSTACK, ctx);
                    };
                    getStream();
                },
                short: streamName,
            };
        });

        const customMenu = {
            [MENUS.LOCALSTACK_LAMBDAS_LOGS_STREAMS]: {
                items: items,
                meta: {
                    isCustom: true,
                },
            },
        };
        ctx.menuMessage = "Select log stream";
        getMenu(MENUS.LOCALSTACK_LAMBDAS_LOGS_STREAMS, ctx, customMenu);
    } else {
        console.log(
            chalk.yellow.bold(
                `No log streams was found for "${logGroupName}" group`
            )
        );
        getMenu(MENUS.LOCALSTACK, ctx);
    }
};

const _getStreamEvents = async (logGroupName, logStreamName) => {
    try {
        const { stdout } = await execa("awslocal", [
            "logs",
            "get-log-events",
            "--log-group-name",
            `${logGroupName}`,
            "--log-stream-name",
            `${logStreamName}`,
        ]);

        return JSON.parse(stdout).events;
    } catch (error) {
        _handleError(error);
    }
};

const _getLogGroupStreams = async (logGroupName) => {
    try {
        const { stdout } = await execa("awslocal", [
            "logs",
            "describe-log-streams",
            "--log-group-name",
            `${logGroupName}`,
            "--descending",
        ]);
        return JSON.parse(stdout).logStreams;
    } catch (error) {
        _handleError(error);
    }
};

const _getStreams = async (ctx, logGroupName) => {
    try {
        const logStreams = await _getLogGroupStreams(logGroupName);
        _buildStreamsMenu(ctx, logStreams, logGroupName);
    } catch (error) {
        _handleError(error);
    }
};

const _getDescribeLogGroups = async () => {
    try {
        const { stdout } = await execa("awslocal", [
            "logs",
            "describe-log-groups",
        ]);

        return JSON.parse(stdout).logGroups;
    } catch (error) {
        _handleError(error);
    }
};

const getLogs = async (ctx) => {
    try {
        const logGroups = await _getDescribeLogGroups(ctx);
        _buildGroupsMenu(ctx, logGroups);
    } catch (error) {
        _handleError(error);
    }
};

const lambda = { listFunctions, getLogs };

module.exports = lambda;
