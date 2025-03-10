// Using the workflow client
import { Client } from "@upstash/workflow";

const workflowClient = new Client({ token: process.env.QSTASH_TOKEN });

export { workflowClient };
