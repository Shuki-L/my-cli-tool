#!/usr/bin/env node

const chalk = require("chalk");
const { DEFAULT_NAME, MENUS, ACTIONS } = require("./constants");

const getMenu = require("./menus");
const performAction = require("./actions");

const ctx = { performAction, mainMenu: MENUS.MAIN, currentMenu: MENUS.MAIN };

const showMenu = () => {
    console.clear();
    const name = false ? `` : DEFAULT_NAME; //allow user to set a name - TBD

    console.log(
        chalk.black.bgWhite.bold(`Welcome to ${name} CLI tool.
This tool will help you with some common tasks.
`)
    );

    getMenu(MENUS.MAIN, ctx);
};

showMenu();
