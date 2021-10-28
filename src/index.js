#!/usr/bin/env node

const chalk = require("chalk");
const { DEFAULT_NAME, MENUS, ACTIONS } = require("./constants");

const getMenu = require("./menus");
const performAction = require("./actions");
const { Octokit } = require("@octokit/core");
const ctx = { performAction, mainMenu: MENUS.MAIN, currentMenu: MENUS.MAIN };

const getLatestRelease = async () => {
    const octokit = new Octokit();
    const {
        data: { tag_name },
    } = await octokit.request("GET /repos/{owner}/{repo}/releases/latest", {
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
    const name = false ? `` : DEFAULT_NAME; //allow user to set a name - TBD
    const currentVersion = process.env.npm_package_version;

    // get latest release
    getLatestRelease()
        .then((latestRelease) => {
            console.log(
                chalk.black.bgWhite.bold(`Welcome to TOOLY 🛠️!`) +
                    chalk.gray(`            (Release: ${currentVersion})`)
            );

            checkForUpdates(currentVersion, latestRelease);
        })
        .catch((err) => {
            console.log(chalk.red(`Error: ${err}`));
        })
        .finally(() => {
            getMenu(MENUS.MAIN, ctx);
        });
};

startApp();
