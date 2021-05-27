#!/usr/bin/env node

const inquirer = require("inquirer");
const chalk = require("chalk");
const { DEFAULT_NAME } = require("./constants");
const { more, localstack, quit, links } = require("./tasks");

const mainMenu = [
    ...[localstack],
    ...links,
    ...[new inquirer.Separator(), more, quit],
];

const showMenu = () => {
    console.clear();
    const name = false ? `` : DEFAULT_NAME; //allow user to set a name - TBD

    console.log(
        chalk.black.bgWhite.bold(`Welcome to ${name} CLI tool.
This tool will help you with some common tasks.
`)
    );
    inquirer
        .prompt([
            {
                type: "rawlist",
                name: "choice",
                message: "What would you like to do?",
                loop: false,
                choices: mainMenu,
            },
        ])
        .then((answers) => {
            if (typeof answers.choice === "function") {
                answers.choice(showMenu);
            } else {
                console.log(
                    chalk.hex("#FFA500")("Ooops, something went wrong...")
                );
            }
        });
};

showMenu();
