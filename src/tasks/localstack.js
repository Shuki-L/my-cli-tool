const inquirer = require("inquirer");
const chalk = require("chalk");

const util = require("util");
const exec = util.promisify(require("child_process").exec);
const { toTime } = require("../utils");

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

                    console.log(logEvents);
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

const action = (goBackCB) => {
    inquirer
        .prompt([
            {
                type: "rawlist",
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
    short: "Query localstack",
};

module.exports = localstack;
