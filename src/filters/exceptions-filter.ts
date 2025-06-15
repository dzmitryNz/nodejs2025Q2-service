import {
  Catch,
  ArgumentsHost,
  HttpServer,
  HttpException,
  LoggerService,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Catch()
export class ExceptionsFilter extends BaseExceptionFilter {
  constructor(
    private readonly logger: LoggerService,
    applicationRef?: HttpServer<any, any>,
  ) {
    super(applicationRef);
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const requestIdHeader = request?.headers['x-request-id'];
    const requestId = Array.isArray(requestIdHeader) 
      ? requestIdHeader[0] 
      : requestIdHeader || uuidv4();

    if (!request) {
      return super.catch(exception, host);
    }

    const errorResponse = this.getErrorResponse(exception, requestId);
    
    this.logger.error(
      `[${requestId}] Error occurred: ${errorResponse.message}`,
      {
        path: request.url,
        method: request.method,
        error: exception,
        requestId,
      },
    );

    return errorResponse;
  }

  private getErrorResponse(exception: unknown, requestId: string) {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      const status = exception.getStatus();

      return {
        statusCode: status,
        message: typeof response === 'string' ? response : response['message'],
        error: response['error'] || HttpStatus[status],
        requestId,
        timestamp: new Date().toISOString(),
      };
    }

    if (exception instanceof Error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: exception.message,
        error: 'Internal Server Error',
        requestId,
        timestamp: new Date().toISOString(),
      };
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error',
      error: 'Internal Server Error',
      requestId,
      timestamp: new Date().toISOString(),
    };
  }
}
