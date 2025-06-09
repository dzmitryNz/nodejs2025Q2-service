import {
  Catch,
  ArgumentsHost,
  HttpServer,
  HttpException,
  LoggerService,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class ExceptionsFilter extends BaseExceptionFilter {
  logger: LoggerService;
  constructor(logger: LoggerService, applicationRef?: HttpServer<any, any>) {
    super(applicationRef);
    this.logger = logger;
  }

  catch(exception: unknown, host: ArgumentsHost) {
    this.logger.error('Exception Handled', undefined, exception);

    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    if (!request) return;

    if (exception instanceof HttpException) {
      throw exception;
    } else if (exception instanceof Error) {
      throw new HttpException(() => exception?.message, HttpStatus.BAD_REQUEST);
    }

    return { error: 'Server Error', status: 500 };
  }
}
