const { CloudWatchLogsClient, 
        DescribeLogGroupsCommand,
        DescribeLogStreamsCommand,
        GetLogEventsCommand } = require("@aws-sdk/client-cloudwatch-logs");

class Logs {
  constructor() {
    this.config = {
        region: "us-east-1",
        credentials: {
            accessKeyId: "accessKeyId",
            secretAccessKey: "secretAccessKey",
        },
        endpoint: "http://localhost:4566",
    };

    this.client = new CloudWatchLogsClient(this.config);
  }

  async getLogGroupStreams(logGroupName) {
    const input = {
        logGroupName: logGroupName,
        descending: true,
        orderBy: "LastEventTime",
    };

    const command = new DescribeLogStreamsCommand(input);
    const response = await this.client.send(command);
    
    return response.logStreams;
  }

  async getStreamEvents(logGroupName, logStreamName) {
    const input = {
        logGroupName: logGroupName,
        logStreamName: logStreamName,
        startFromHead: false,
    };

    const command = new GetLogEventsCommand(input);
    const response = await this.client.send(command);

    return response.events;
  }

  async getLogGroups() {
    const input = {
        limit: 50,
    };

    const command = new DescribeLogGroupsCommand(input);
    const response = await this.client.send(command);

    return response.logGroups;
  }
}


module.exports = Logs;
