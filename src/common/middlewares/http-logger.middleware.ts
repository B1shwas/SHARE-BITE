import { Injectable, NestMiddleware } from '@nestjs/common';
import { logger } from 'config/logger';
import { Request, Response } from 'express';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    const { method, originalUrl } = req;
    const start = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - start;
      const message = `${method} ${originalUrl} ${statusCode} ${duration}ms`;

      if (statusCode >= 500) {
        logger.error(message, {
          statusCode,
          duration,
          body: req.body,
          query: req.query,
        });
      } else if (statusCode >= 400) {
        logger.warn(message, {
          statusCode,
          duration,
          body: req.body,
          query: req.query,
        });
      } else {
        logger.info(message, { statusCode, duration });
      }
    });
    next();
  }
}
