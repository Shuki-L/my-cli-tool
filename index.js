#!/usr/bin/env node

const inquirer = require("inquirer");
const cfonts = require("cfonts");
const chalk = require("chalk");
const { DEFAULT_NAME } = require("./constants");
const { more, localstack, quit, links } = require("./tasks");

const mainMenu = [
    ...[localstack],
    ...links,
    ...[new inquirer.Separator(), more, quit],
];

// const fs = require('fs')

// fs.readFile('/Users/joe/test.txt', 'utf8' , (err, data) => {
//   if (err) {
//     console.error(err)
//     return
//   }
//   console.log(data)
// })

const showMenu = () => {
    console.clear();
    const name = false ? `` : DEFAULT_NAME; //allow user to set a name - TBD
    cfonts.say(`${name} CLI Tool`, { background: "blue", align: "center" });

    console.log(
        chalk.black.bgWhite.bold(`Welcome to ${name} CLI tool.
This tool will help you with some common tasks.
`)
    );
    inquirer
        .prompt([
            {
                type: "list", //change to rawlist once https://github.com/SBoudrias/Inquirer.js/pull/1013 is done§
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
