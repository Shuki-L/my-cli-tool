const inquirer = require("inquirer");

const goBack = (goBack) => {
    return [
        new inquirer.Separator(),
        { name: "Go Back", value: goBack, short: "Going Back" },
    ];
};

const toTime = (epocTime) => {
    return new Date(epocTime).toISOString().slice(0, 19).replace("T", " ");
};

module.exports = {
    goBack,
    toTime,
};
