const util = require("util");
const exec = util.promisify(require("child_process").exec);

const listFunctions = async () => {
    const { error, stdout, stderr } = await exec(
        `awslocal lambda list-functions`
    );

    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }

    const functions = JSON.parse(stdout).Functions;

    const names = functions.map((func) => {
        return {
            FunctionName: func.FunctionName,
            Description: func.Description,
        };
    });

    console.table(names);
};

const lambda = { listFunctions };

module.exports = { lambda };
