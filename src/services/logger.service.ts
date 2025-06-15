import { LoggerService, Logger } from '@nestjs/common';

export class CustomLogger extends Logger implements LoggerService {
  protected context?: string;

  constructor(context?: string) {
    super(context);
    this.context = context;
  }

  log(message: string, metadata?: any) {
    super.log(message, metadata);
  }

  error(message: string, trace?: string, metadata?: any) {
    super.error(message, trace, metadata);
  }

  warn(message: string, metadata?: any) {
    super.warn(message, metadata);
  }

  debug(message: string, metadata?: any) {
    super.debug(message, metadata);
  }

  verbose(message: string, metadata?: any) {
    super.verbose(message, metadata);
  }
} 