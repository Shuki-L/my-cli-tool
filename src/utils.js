const toTime = (epocTime) => {
    return new Date(epocTime).toISOString().slice(0, 19).replace("T", " ");
};

const prettyPringLambdaLogsEvents = (events) => {
    if (events.length > 0) {
        const startTime = toTime(events[0].timestamp);
        const endTime = toTime(events[events.length - 1].timestamp);
    }
};

module.exports = {
    toTime,
};
