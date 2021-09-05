const execa = require("execa");
const chalk = require("chalk");
const { Table } = require("console-table-printer");
const getMenu = require("../../menus");
const { MENUS } = require("../../constants");
const { handleError } = require("../../utils");

const showStatus = async (ctx) => {
    try {
        const eventBusesList = await execa("awslocal", [
            "events",
            "list-event-buses",
        ]);

        const eventBuses = JSON.parse(eventBusesList.stdout).EventBuses;
        // console.log(eventBuses);

        const rulesList = await execa("awslocal", ["events", "list-rules"]);

        const rules = JSON.parse(rulesList.stdout).Rules;
        // console.log(rules);

        const t = new Table({
            columns: [
                {
                    name: "eventBus",
                    title: "Event Bus",
                    alignment: "left",
                    color: "green",
                },

                {
                    name: "rule",
                    title: "Rules",
                    alignment: "left",
                    color: "red",
                },
                {
                    name: "eventPatternSource",
                    title: "Pattern Source",
                    alignment: "left",
                    color: "blue",
                },
                {
                    name: "eventPatternDetailType",
                    title: "Pattern Detail Type",
                    alignment: "left",
                    color: "blue",
                },
                {
                    name: "eventPatternDetail",
                    title: "Pattern Detail",
                    alignment: "left",
                    color: "blue",
                },
                {
                    name: "target",
                    title: "Targets",
                    alignment: "left",
                    color: "cyan",
                },
            ],
        });

        const busesDeleteCommands = [];
        const rulesDeleteCommands = [];

        for (const eventBus of eventBuses) {
            // add delete to useful commands
            busesDeleteCommands.push(
                `awslocal events delete-event-bus --name ${eventBus.Name}`
            );

            // Get rules
            const rulesForEventBus = rules.filter(
                (rule) => rule.EventBusName === eventBus.Name
            );
            if (rulesForEventBus.length === 0) {
                t.addRow({
                    eventBus: `${eventBus.Name}`,
                });
            } else {
                for (let index = 0; index < rulesForEventBus.length; index++) {
                    const rule = rulesForEventBus[index];
                    // add delete to useful commands
                    rulesDeleteCommands.push(
                        `awslocal events delete-rule --event-bus-name ${eventBus.Name} --name ${rule.Name}`
                    );

                    // get target for rule
                    const ruleTargets = await execa("awslocal", [
                        "events",
                        "list-targets-by-rule",
                        "--rule",
                        rule.Name,
                    ]);

                    const targets = JSON.parse(ruleTargets.stdout).Targets;

                    if (targets.length === 0) {
                        t.addRow({
                            eventBus: `${eventBus.Name}`,
                            rule: rule.Name,
                            eventPatternSource: JSON.parse(rule.EventPattern)
                                .source,
                            eventPatternDetailType: JSON.parse(
                                rule.EventPattern
                            )["detail-type"],
                            eventPatternDetail: JSON.stringify(
                                JSON.parse(rule.EventPattern).detail
                            ),
                        });
                    } else {
                        for (let index = 0; index < targets.length; index++) {
                            target = targets[index];
                            targetArnArray = target.Arn.split(":");
                            targetArnArray =
                                targetArnArray[targetArnArray.length - 1];
                            t.addRow({
                                eventBus: `${eventBus.Name}`,
                                rule: rule.Name,
                                eventPatternSource:
                                    rule.EventPattern !== "null"
                                        ? JSON.parse(rule.EventPattern).source
                                        : "",
                                eventPatternDetailType:
                                    rule.EventPattern !== "null"
                                        ? JSON.parse(rule.EventPattern)[
                                              "detail-type"
                                          ]
                                        : "",
                                eventPatternDetail:
                                    rule.EventPattern !== "null"
                                        ? JSON.stringify(
                                              JSON.parse(rule.EventPattern)
                                                  .detail
                                          )
                                        : "",
                                target: targetArnArray,
                            });
                        }
                    }
                }
            }
        }

        t.printTable();

        console.log(
            chalk.yellow.bold.underline("Useful Commands - delete event bus")
        );
        busesDeleteCommands.forEach((command) => {
            console.log(command);
        });
        console.log(
            chalk.yellow.bold.underline("Useful Commands - delete rule")
        );
        rulesDeleteCommands.forEach((command) => {
            console.log(command);
        });

        getMenu(MENUS.LOCALSTACK, ctx);
    } catch (error) {
        handleError(error);
    }
};

const eventBridge = { showStatus };

module.exports = eventBridge;
