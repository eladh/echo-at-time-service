import * as cluster from "cluster";
import {
  Event,
  initMetrics,
  MetricsEvent,
  MetricsEvents,
} from "../metrics/monitor";
import * as os from "os";

const keysAllocations: Map<number, number> = new Map<number, number>();

function initWorker(currentWorker: cluster.Worker) {
  currentWorker.on("exit", () => {
    const currentProcessId = currentWorker.process.pid;
    const processingKeyId = keysAllocations.get(currentProcessId);
    const newWorker: cluster.Worker = cluster.fork({
      STORE_KEY_ID: `messages_${processingKeyId}`,
    });

    keysAllocations.set(newWorker.process.pid, processingKeyId);
    keysAllocations.delete(currentProcessId);

    initWorker(newWorker);
  });

  if (process.env.CHAOS) {
    setTimeout(() => {
      console.error("kill server");
      currentWorker.process.kill();
    }, (Math.random() * 10 + 10) * 1000);
  }
}

export function startCluster(bootstrap: () => Promise<void>) {
  const clusterSize: number = process.env.CLUSTER ? os.cpus().length : 1;
  if (cluster.isMaster) {
    for (let i = 0; i < clusterSize; ++i) {
      const newWorker: cluster.Worker = cluster.fork({
        STORE_KEY_ID: `messages_${i}`,
      });

      keysAllocations.set(newWorker.process.pid, i);
      initWorker(newWorker);
    }

    const metricsEvents: MetricsEvents = initMetrics();

    cluster.on("message", (worker: cluster.Worker, event: Event) => {
      if (event.type === MetricsEvent.MESSAGES_PER_SEC) {
        metricsEvents.messagesPerSec.set(event.value);
      }
    });
  } else {
    bootstrap();
  }
}
