import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  MemoryHealthIndicator,
  HttpHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
    private http: HttpHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    const PORT = process.env.PORT || 3000;
    const devServer = `http://localhost:${PORT}`;

    return this.health.check([
      () =>
        this.http.pingCheck(
          'examly-server',
          process.env.NODE_ENV === 'development'
            ? devServer
            : process.env.NEST_API_BASE!,
        ),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024), // 150MB threshold
      () => this.memory.checkRSS('memory_rss', 300 * 1024 * 1024), // 300MB threshold
    ]);
  }
}
