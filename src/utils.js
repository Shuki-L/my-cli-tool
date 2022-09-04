const chalk = require("chalk");

const toTime = (epocTime) => {
  console.log(`Converting epocTime: ${epocTime}`);
  try {
    const date = new Date(epocTime);
    return date.toISOString().slice(0, 19).replace("T", " ");
  } catch (error) {
    console.log(chalk.red.bold(`Error converting epocTime: ${epocTime}`));
    console.log(chalk.red.bold(`Error: ${error}`));
    return epocTime;
  }
};

const prettyPrintLambdaLogsEvents = (events) => {
  if (events.length > 0) {
    const startTime = toTime(events[0].timestamp);
    const endTime = toTime(events[events.length - 1].timestamp);
  }
};

const handleError = (error) => {
  if (error.exitCode) {
    switch (error.exitCode) {
      case 255:
        console.log(
          chalk.red.bold("ERROR: make sure you have localstack up and running")
        );
        break; // TODO: add verbose mode

      default:
        console.log(error);
        break;
    }
  } else {
    console.log(error);
  }
};

module.exports = {
  toTime,
  handleError,
};
