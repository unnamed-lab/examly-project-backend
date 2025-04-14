import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from 'config/configuration';

@Module({
  imports: [
    TerminusModule,
    HttpModule,
    TerminusModule.forRoot({
      gracefulShutdownTimeoutMs: 1000,
    }),
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath: ['.env.local', '.env'],
      isGlobal: true,
      cache: true,
    }),
  ],
  providers: [ConfigService],
  controllers: [HealthController],
})
export class HealthModule {}
