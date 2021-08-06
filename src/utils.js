const toTime = (epocTime) => {
    return new Date(epocTime).toISOString().slice(0, 19).replace("T", " ");
};

const prettyPringLambdaLogsEvents = (events) => {
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
                    chalk.red.bold(
                        "ERROR: make shure you have localstack up and running"
                    )
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
