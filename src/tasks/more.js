const inquirer = require("inquirer");

const action = () => {
    inquirer.prompt(
        [
            {
                name: "github",
                type: "confirm",
                message: "Have you read a book lately?",
                default: true,
            },
            {
                when: function (response) {
                    return response.github;
                },
                name: "good-or-not",
                message: "Sweet! Was it any good?",
            },
        ],
        function (response) {}
    );
};

const more = {
    name: "Show me more",
    value: action,
    short: "More",
};

module.exports = more;
