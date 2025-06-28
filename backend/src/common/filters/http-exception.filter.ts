import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let validationErrors: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || responseObj.error || exception.message;
        validationErrors = responseObj.validationErrors || null;
      } else {
        message = exceptionResponse as string;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    // Log the error
    const errorLog = {
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      statusCode: status,
      message,
      stack: exception instanceof Error ? exception.stack : null,
      userAgent: request.get('User-Agent'),
      ip: request.ip,
    };

    if (status >= 500) {
      this.logger.error('Server Error', errorLog);
    } else {
      this.logger.warn('Client Error', errorLog);
    }

    // Prepare response
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      ...(validationErrors && { validationErrors }),
      ...(process.env.NODE_ENV === 'development' && exception instanceof Error && { stack: exception.stack }),
    };

    response.status(status).json(errorResponse);
  }
} 