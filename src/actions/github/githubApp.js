const fs = require("fs");
const chalk = require("chalk");
const { createAppAuth } = require("@octokit/auth-app");
const { request } = require("@octokit/request");
const input = require("@inquirer/input");
const getMenu = require("../../menus");
const { MENUS } = require("../../constants");

const getJWT = async (appId, pemFilePath) => {
  try {
    const privateKey = fs.readFileSync(pemFilePath);
    const auth = createAppAuth({
      appId,
      privateKey,
    });

    const appAuthentication = await auth({ type: "app" });
    return appAuthentication.token;
  } catch (error) {
    console.log(error);
  }
};

const getAppInstallations = async (ctx) => {
  try {
    const appId = await input({ message: "Enter your GitHub App ID: " });

    const pemFilePath = await input({
      message: "Enter your GitHub App Private Key full file path (PEM): ",
    });

    // List installations for the authenticated app
    const token = await getJWT(appId, pemFilePath);
    console.log(chalk.yellow.bold("Getting App Installations..."));

    const result = await request("GET /app/installations", {
      headers: {
        authorization: "Bearer " + token,
      },
    });
    if (result.status === 200) {
      const installations = result.data;
      console.log(chalk.yellow.bold("App Installations:"));
      console.info(installations);
      console.log(
        chalk.green.bold(`Total installations: ${installations.length}`)
      );
    } else {
      console.log(chalk.red.bold("Error: " + result.status));
      console.log(chalk.red.bold(result.data));
    }
    getMenu(MENUS.GITHUB, ctx);
  } catch (error) {
    console.log(error);
  }
};

const githubApp = { getAppInstallations };

module.exports = githubApp;
