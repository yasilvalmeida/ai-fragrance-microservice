import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HealthService {
  constructor(private configService: ConfigService) {}

  async getHealthStatus() {
    const status = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'ai-fragrance-microservice',
      version: '1.0.0',
      checks: {
        openai: this.checkOpenAIConfig(),
        database: 'ok', // No database in this example
        memory: this.getMemoryUsage(),
      },
    };

    return status;
  }

  private checkOpenAIConfig(): string {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    return apiKey ? 'configured' : 'not_configured';
  }

  private getMemoryUsage() {
    const usage = process.memoryUsage();
    return {
      rss: `${Math.round(usage.rss / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(usage.heapTotal / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(usage.heapUsed / 1024 / 1024)}MB`,
      external: `${Math.round(usage.external / 1024 / 1024)}MB`,
    };
  }
} 