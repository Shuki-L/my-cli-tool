const chalk = require("chalk");

const action = () => {
    console.clear();

    console.log(chalk.black.bgWhite.bold("Hope you enjoyed this tool."));
    console.log(chalk.black.bgWhite.bold("see you next time."));

    process.exit(1);
};

const quit = { name: "Quit", value: action, short: "Quit" };

module.exports = quit;
