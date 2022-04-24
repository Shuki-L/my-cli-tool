const fs = require("fs");
const chalk = require("chalk");
const { Table } = require("console-table-printer");

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
      if (installations.length == 0) {
        console.log(chalk.yellow.bold("No installations found"));
      } else {
        const appName = `${installations[0].app_slug}(${installations[0].app_id})`;
        console.log(chalk.yellow.bold(`${appName} Installations:`));

        const orgName = installations[0].account.login;
        const t = new Table({
          columns: [
            {
              name: "id",
              title: "Installation ID",
              alignment: "left",
              color: "green",
            },
            {
              name: "orgName",
              title: "Org Name",
              alignment: "left",
              color: "yellow",
            },
            {
              name: "orgType",
              title: "Org Type",
              alignment: "left",
              color: "yellow",
            },
            {
              name: "createdAt",
              title: "Created At",
              alignment: "left",
              color: "green",
            },
            {
              name: "updatedAt",
              title: "Updated At",
              alignment: "left",
              color: "yellow",
            },
          ],
        });

        for (const installation of installations) {
          t.addRow({
            id: installation.id,
            orgName: installation.account.login,
            orgType: installation.account.type,
            createdAt: installation.created_at,
            updatedAt: installation.updated_at,
          });
        }

        t.printTable();
        console.log(
          chalk.green.bold(`Total installations: ${installations.length}`)
        );
        const showFull = await input({
          message: "Do you want to see full installations details (y/n)? ",
        });

        if (
          showFull.toLowerCase() === "yes" ||
          showFull.toLowerCase() === "y"
        ) {
          console.info(installations);
          console.log(
            chalk.green.bold(`Total installations: ${installations.length}`)
          );
        }
      }
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
