import { Controller, Get } from "@nestjs/common";
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
} from "@nestjs/terminus";
import { HealthCheckResult } from "@nestjs/terminus/dist/health-check/health-check-result.interface";

@Controller("health")
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator
  ) {}

  @Get()
  @HealthCheck()
  check(): HealthCheckResult {
    return {
      status: "ok",
      details: {
        done: {
          status: "up",
        },
      },
    };
  }
}
