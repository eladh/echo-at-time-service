import { Gauge, Registry } from "prom-client";
import * as express from "express";
import * as client from "prom-client";

export interface MetricsEvents {
  messagesPerSec: Gauge<string>;
}

export enum MetricsEvent {
  MESSAGES_PER_SEC,
}

export interface Event {
  type: MetricsEvent;
  value: any;
}

export function initMetrics(): MetricsEvents {
  const registry: Registry = new client.Registry();

  const messagesPerSec: Gauge<string> = new client.Gauge({
    name: "processed_messages_in_sec",
    help: "Amount of processed messages per second",
    registers: [registry],
  });

  // Run the metrics server
  const app = express();

  app.listen(9200, "0.0.0.0", () => console.log("Metrics server started!"));
  // Report Prometheus metrics on /metrics event
  app.get("/metrics", (req, res) => {
    registry.metrics().then((str) => {
      res.set("Content-Type", registry.contentType);
      res.send(str);
    });
  });

  return { messagesPerSec };
}
