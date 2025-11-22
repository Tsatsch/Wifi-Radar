import { cre, Runner, type Runtime, type Task } from "@chainlink/cre-sdk";
import { wifiSpeedSim } from "./tasks/wifi-speed-sim"; // import the task

type Config = {
  schedule: string;
};

// Example test input (you can also load from a file or runtime input)
const testInput = {
  location: "Prague, CZ",
  lat: 50.0755,
  lon: 14.4378,
  download: 76.2,
  upload: 13.4,
  timestamp: "2025-11-22T12:23:00Z"
};

const onCronTrigger = async (runtime: Runtime<Config>): Promise<any> => {
  runtime.log("Hello world! Workflow triggered.");

  try {
    // Run the WiFi speed simulation task
    const result = await wifiSpeedSim(testInput as any);
    runtime.log("WiFi speed simulation result:", JSON.stringify(result, null, 2));

    return result;
  } catch (err) {
    runtime.log("Error running WiFi speed simulation:", err);
    throw err;
  }
};

const initWorkflow = (config: Config) => {
  const cron = new cre.capabilities.CronCapability();

  return [
    cre.handler(
      cron.trigger(
        { schedule: config.schedule } // e.g., "* * * * *" for every minute
      ),
      onCronTrigger
    ),
  ];
};

export async function main() {
  const runner = await Runner.newRunner<Config>();
  await runner.run(initWorkflow);
}

main();
