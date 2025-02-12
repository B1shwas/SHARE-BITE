import { Injectable, LoggerService } from '@nestjs/common';
import { logger } from 'config/logger';

@Injectable()
export class AppLogger implements LoggerService {
  private context: string;

  setContext(context: string) {
    this.context = context;
  }

  log(message: any, context?: string) {
    logger.info(message, { context: context || this.context });
  }

  error(message: any, trace?: string, context?: string) {
    logger.error(message, { stack: trace, context: context || this.context });
  }

  warn(message: any, context?: string) {
    logger.warn(message, { context: context || this.context });
  }

  debug(message: any, context?: string) {
    logger.debug(message, { context: context || this.context });
  }

  verbose(message: any, context?: string) {
    logger.verbose(message, { context: context || this.context });
  }
}
