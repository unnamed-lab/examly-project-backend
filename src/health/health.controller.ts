import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation } from '@nestjs/swagger';
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
    private configService: ConfigService,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Get server health status' })
  check() {
    const PORT = this.configService.get<string>('PORT') || 3000;
    const devServer = `http://localhost:${PORT}`;

    return this.health.check([
      () =>
        this.http.pingCheck(
          'examly-server',
          this.configService.get('NODE_ENV') === 'development'
            ? devServer
            : this.configService.get('NEST_API_BASE'),
        ),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024), // 150MB threshold
      () => this.memory.checkRSS('memory_rss', 300 * 1024 * 1024), // 300MB threshold
    ]);
  }
}
