const execa = require("execa");
const chalk = require("chalk");

const getMenu = require("../../menus");
const Logs = require("./logs");
const { ACTIONS, MENUS } = require("../../constants");
const { toTime, handleError } = require("../../utils");

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
        handleError(error);
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
            const streamName = `${i + 1}) ${toTime(s.lastEventTimestamp)}`;
            return {
                name: streamName,
                value: (ctx) => {
                    const streamCopy = { ...s };
                    const getStream = async () => {
                        logEvents = await _getStreamEvents(
                            logGroupName,
                            streamCopy.logStreamName
                        );
                        // console.dir(logEvents);
                        _prettyPrint(logEvents);
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

const _prettyPrint = (logEvents) => {
    const NO_COLOR_REGEX =
        /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;

    // remove colors from messages
    // and filter out empty messages and START/END messages
    logMessages = logEvents
        .map((e) => e.message.replace(NO_COLOR_REGEX, ""))
        .filter(
            (m) => m !== "" && !m.startsWith("START") && !m.startsWith("END")
        );

    console.log();
    logMessages.forEach((m) => {
        if (!m.startsWith("REPORT")) {
            console.log(chalk.yellow.bold(m));
        } else {
            console.log();
            const report = m.split("\t");
            report.forEach((r) => {
                console.log(chalk.blue.bold(r));
            });
        }
    });
};

const _getStreamEvents = async (logGroupName, logStreamName) => {
    try {
        const events = await new Logs().getStreamEvents(logGroupName, logStreamName);
        return events;
    } catch (error) {
        handleError(error);
    }
};

const _getStreams = async (ctx, logGroupName) => {
    try {
        const logStreams = await new Logs().getLogGroupStreams(logGroupName);
        _buildStreamsMenu(ctx, logStreams, logGroupName);
    } catch (error) {
        handleError(error);
    }
};

const getLogs = async (ctx) => {
    try {
        const logGroups = await new Logs().getLogGroups();
        _buildGroupsMenu(ctx, logGroups);
    } catch (error) {
        handleError(error);
    }
};

const lambda = { listFunctions, getLogs };

module.exports = lambda;
