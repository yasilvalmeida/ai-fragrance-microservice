import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const startTime = Date.now();
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('User-Agent') || '';

    // Log request
    this.logger.log(`${method} ${originalUrl} - ${ip} - ${userAgent}`);

    // Override res.end to capture response
    const originalEnd = res.end;
    res.end = function(chunk?: any, encoding?: any) {
      const duration = Date.now() - startTime;
      const { statusCode } = res;
      const contentLength = res.get('Content-Length') || 0;

      // Log response
      const logLevel = statusCode >= 400 ? 'error' : statusCode >= 300 ? 'warn' : 'log';
      const logger = new Logger('HTTP');
      
      logger[logLevel](
        `${method} ${originalUrl} - ${statusCode} - ${duration}ms - ${contentLength} bytes`
      );

      // Call original end method
      originalEnd.call(this, chunk, encoding);
    };

    next();
  }
} 