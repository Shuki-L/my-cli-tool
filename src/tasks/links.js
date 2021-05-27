const inquirer = require("inquirer");
const open = require("open");
const { DEFAULT_LINKS } = require("../constants");

// get defult links and override from toolrc.json file

const links =
    DEFAULT_LINKS.length > 0
        ? [
              ...[new inquirer.Separator("------- Links -------")],
              ...DEFAULT_LINKS.map((link) => {
                  return {
                      name: link.name,
                      value: () => {
                          console.log(`Opening ${link.short}...`);
                          open(link.url);
                      },
                      short: link.short,
                  };
              }),
          ]
        : [];

module.exports = links;
