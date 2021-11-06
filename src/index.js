#!/usr/bin/env node

const chalk = require("chalk");
const { MENUS } = require("./constants");

const getMenu = require("./menus");
const performAction = require("./actions");
const { Octokit } = require("@octokit/rest");
const ctx = { performAction, mainMenu: MENUS.MAIN, currentMenu: MENUS.MAIN };

const octokit = new Octokit();

const getLatestRelease = async () => {
    const {
        data: { tag_name },
    } = await octokit.repos.getLatestRelease({
        owner: "Shuki-L",
        repo: "my-cli-tool",
    });
    return tag_name;
};

const checkForUpdates = (currentVersion, latestRelease) => {
    if (currentVersion !== latestRelease) {
        console.log(
            chalk.yellow(
                `✨✨✨ New version of Tooly is available.\nInstall it now by running:\n` +
                    chalk.yellow.bold(
                        `npm install -g git+ssh://git@github.com:Shuki-L/my-cli-tool`
                    )
            )
        );
    }
};

const startApp = async () => {
    console.clear();
    const { version } = require("../package.json");

    // get latest release
    getLatestRelease()
        .then((latestRelease) => {
            console.log(
                chalk.black.bgWhite.bold(`   Welcome to TOOLY 🛠️!   `) +
                    chalk.gray(`            (Release: ${version})`)
            );

            checkForUpdates(version, latestRelease);
        })
        .catch((err) => {
            console.log(chalk.red(`Error: ${err}`));
        })
        .finally(() => {
            getMenu(MENUS.MAIN, ctx);
        });
};

startApp();
