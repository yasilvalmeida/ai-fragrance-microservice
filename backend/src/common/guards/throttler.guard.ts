import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { SKIP_THROTTLE_KEY } from '../decorators/skip-throttle.decorator';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  constructor(private reflector: Reflector) {
    super();
  }

  protected async shouldSkip(context: ExecutionContext): Promise<boolean> {
    return this.reflector.getAllAndOverride<boolean>(SKIP_THROTTLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }
  protected getTracker(req: Record<string, any>): string {
    // Use IP address for tracking
    return req.ip || req.connection.remoteAddress;
  }

  protected generateKey(context: ExecutionContext, tracker: string): string {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    
    // Create unique key based on method, URL, and tracker
    return `${method}-${url}-${tracker}`;
  }
} 