const chalk = require("chalk");

const quit = () => {
    console.log(chalk.black.bgWhite.bold("Hope you enjoyed this tool."));
    console.log(chalk.black.bgWhite.bold("see you next time."));

    process.exit(1);
};

module.exports = quit;
