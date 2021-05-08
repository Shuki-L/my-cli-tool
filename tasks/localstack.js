const inquirer = require("inquirer");
const chalk = require("chalk");

const util = require("util");
const exec = util.promisify(require("child_process").exec);
const { goBack, toTime } = require("../helpers");

const { lambda } = require("./localstack/lambda");

const selectLambdaLogStream = (formattedStream) => {
    inquirer
        .prompt([
            {
                type: "list",
                name: "stream",
                message: "Which stream are you interested in?",
                loop: false,
                choices: formattedStream.map((stream) => {
                    return {
                        name: stream.displayName,
                        value: stream.logStreamName,
                        short: stream.displayName,
                    };
                }),
            },
        ])
        .then((answers) => {
            exec(
                `awslocal logs get-log-events --log-group-name ${logGroupName} --log-stream-name ${answers.stream}`,
                (error, stdout, stderr) => {
                    if (error) {
                        console.log(`error: ${error.message}`);
                        return;
                    }
                    if (stderr) {
                        console.log(`stderr: ${stderr}`);
                        return;
                    }

                    const logEvents = JSON.parse(stdout).events;

                    console.table(logEvents);
                    // logEvents.map((event) => {
                    //     // console.log(event.timestamp);
                    //     console.log(event.message);
                    //     // console.log(event.ingestionTime);
                    // });

                    lambdaLogsAction();
                }
            );
        });
};

const LambdaGroupNameAction = async (logGroupName) => {
    //get list of log groups streams
    const { error, stdout, stderr } = await exec(
        `awslocal logs describe-log-streams --log-group-name ${logGroupName} --descending`
    );

    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }

    const formattedStream = [];
    const logStreams = JSON.parse(stdout).logStreams;

    if (logStreams.length > 0) {
        logStreams.forEach((stream, i) => {
            formattedStream.push({
                displayName: `${i + 1}) ${toTime(stream.creationTime)}`,
                logStreamName: stream.logStreamName,
            });
        });

        // prompt user to select lambda log stream
        selectLambdaLogStream(formattedStream);
    } else {
        console.log(`couldn't fine any log stream`);
    }
};

const selectLambdaGroupName = (logGroupsNames) => {
    inquirer
        .prompt([
            {
                type: "list",
                name: "choice",
                message: "Which function are you interested in?",
                loop: false,
                choices: logGroupsNames.map((groupName) => {
                    return {
                        name: groupName.split("/").pop(),
                        value: groupName,
                        short: groupName.split("/").pop(),
                    };
                }),
            },
        ])
        .then((answers) => {
            logGroupName = answers.choice;
            LambdaGroupNameAction(logGroupName);
        });
};

const lambdaLogsAction = async () => {
    //get list of log groups
    const { error, stdout, stderr } = await exec(
        "awslocal logs describe-log-groups"
    );

    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }

    const logGroupsNames = [];
    const logGroups = JSON.parse(stdout).logGroups;

    if (logGroups.length > 0) {
        logGroups.forEach((group) => {
            logGroupsNames.push(group.logGroupName);
        });

        // prompt user to select lambda groupName
        selectLambdaGroupName(logGroupsNames);
    } else {
        console.log(`couldn't fine any log group`);
    }
};

const action = (goBackCB) => {
    inquirer
        .prompt([
            {
                type: "list", //change to rawlist once https://github.com/SBoudrias/Inquirer.js/pull/1013 is done
                name: "choice",
                message: "Sweet! What you would like to see in localstack?",
                loop: false,
                choices: [...localstackMenu, ...goBack(goBackCB)],
            },
            {
                when: function (response) {
                    return response.github;
                },
                name: "good-or-not",
                message: "Sweet! Was it any good?",
            },
        ])
        .then((answers) => {
            if (typeof answers.choice === "function") {
                answers.choice();
            } else {
                console.log(
                    chalk.hex("#FFA500")("Ooops, something went wrong...")
                );
            }
        });
};

const localstackMenu = [
    {
        name: "Get Lambda logs",
        value: lambdaLogsAction,
        short: "Lambda logs",
    },
    {
        name: "Get Lambdas names",
        value: lambda.listFunctions,
        short: "Lambdas names",
    },
];

const localstack = {
    name: "Query localstack",
    value: action,
    short: "Short Query localstack",
};

module.exports = localstack;
