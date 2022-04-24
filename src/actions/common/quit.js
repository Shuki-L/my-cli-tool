const chalk = require("chalk");

const quit = () => {
    console.log(chalk.black.bgWhite.bold("See you next time."));

    process.exit(0);
};

module.exports = quit;
