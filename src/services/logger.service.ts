import { LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

export class CustomLogger implements LoggerService {
  private logger: winston.Logger;

  constructor(context?: string) {
    const logDir = 'logs';
    const { combine, timestamp, printf, colorize } = winston.format;

    const logFormat = printf(({ level, message, timestamp, context, ...metadata }) => {
      let msg = `${timestamp} [${level}]${context ? ` [${context}]` : ''} : ${message}`;
      if (Object.keys(metadata).length > 0) {
        msg += ` ${JSON.stringify(metadata)}`;
      }
      return msg;
    });

    this.logger = winston.createLogger({
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
      ),
      defaultMeta: { context },
      transports: [
        // Console transport
        new winston.transports.Console({
          format: combine(
            colorize(),
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            logFormat
          ),
        }),
        // File transport with rotation
        new winston.transports.DailyRotateFile({
          dirname: logDir,
          filename: 'application-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m', // Rotate when file reaches 20MB
          maxFiles: '14d', // Keep logs for 14 days
          format: combine(
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            logFormat
          ),
        }),
        // Error log file with rotation
        new winston.transports.DailyRotateFile({
          dirname: logDir,
          filename: 'error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '14d',
          level: 'error',
          format: combine(
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            logFormat
          ),
        }),
      ],
    });
  }

  log(message: string, metadata?: any) {
    this.logger.info(message, metadata);
  }

  error(message: string, trace?: string, metadata?: any) {
    this.logger.error(message, { trace, ...metadata });
  }

  warn(message: string, metadata?: any) {
    this.logger.warn(message, metadata);
  }

  debug(message: string, metadata?: any) {
    this.logger.debug(message, metadata);
  }

  verbose(message: string, metadata?: any) {
    this.logger.verbose(message, metadata);
  }
} 