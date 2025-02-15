import { createLogger } from 'winston';
import { winstonConfig } from './winston.config';

export const logger = createLogger(winstonConfig);
