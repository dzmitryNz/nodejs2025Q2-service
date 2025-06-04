import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  Req,
  Res,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

@Injectable()
export class RequestInterceptor implements NestInterceptor {
  constructor(private logger: Logger) {}

  private formatRequest(@Req() req: Request | null) {
    return req
      ? {
          body: req.body,
          url: req.url,
          headers: req.headers,
          method: req.method,
          path: req.url,
        }
      : null;
  }

  private formatResponse(@Res() res: Response) {
    return {
      code: res.status,
    };
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const req: Request = http.getRequest();
    const res: Response = http.getResponse();

    if (!req) {
      return next.handle();
    }

    const request = this.formatRequest(req);

    this.logger.verbose(
      `${req.method.toUpperCase()} ${req.url} ${req.headers['user-agent']}`,
      { request },
    );

    return next
      .handle()
      .pipe(
        tap((response) => {
          this.logger.verbose(
            `${req.method.toUpperCase()} ${req.url} ${res.status} ${req.headers['user-agent']}`,
            {
              response: this.formatResponse(res),
              data: response,
            },
          );
        }),
        map((response) => response),
      )
      .pipe(
        catchError((error: Error) => {
          this.logger.warn('Request Error', {
            response: error.message,
            error,
          });
          return throwError(() => error);
        }),
      );
  }
}
