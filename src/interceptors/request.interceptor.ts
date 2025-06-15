import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  LoggerService,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RequestInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  private formatRequest(req: Request) {
    return {
      body: req.body,
      url: req.url,
      headers: req.headers,
      method: req.method,
      path: req.url,
      query: req.query,
      params: req.params,
    };
  }

  private formatResponse(res: Response) {
    return {
      statusCode: res.statusCode,
      statusMessage: res.statusMessage,
    };
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const req: Request = http.getRequest();
    const res: Response = http.getResponse();

    if (!req) {
      return next.handle();
    }

    const requestId = req.headers['x-request-id'] || uuidv4();
    req.headers['x-request-id'] = requestId;
    res.setHeader('x-request-id', requestId);

    const request = this.formatRequest(req);
    const startTime = Date.now();

    this.logger.log(
      `[${requestId}] ${req.method.toUpperCase()} ${req.url}`,
      {
        request,
        userAgent: req.headers['user-agent'],
      },
    );

    return next.handle().pipe(
      tap((response) => {
        const duration = Date.now() - startTime;
        this.logger.log(
          `[${requestId}] ${req.method.toUpperCase()} ${req.url} ${res.statusCode} - ${duration}ms`,
          {
            response: this.formatResponse(res),
            data: response,
            duration,
          },
        );
      }),
      catchError((error: Error) => {
        const duration = Date.now() - startTime;
        this.logger.error(
          `[${requestId}] ${req.method.toUpperCase()} ${req.url} - Error after ${duration}ms`,
          {
            error: error.message,
            stack: error.stack,
            duration,
          },
        );
        throw error;
      }),
    );
  }
}
