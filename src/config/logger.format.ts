import { format } from 'winston';
import { Format } from 'logform';
import 'winston-daily-rotate-file';
import * as dayjs from 'dayjs';

export const winstonLoggerFormat: Format = format.combine(
  format.timestamp(),
  format.errors({ stack: true }),
  format((info) => {
    info.level = info.level.toUpperCase();
    return info;
  })(),
  format.colorize({ all: true }),
  format.printf(({ timestamp, level, message, context, stack }) => {
    const formattedDate = dayjs(timestamp as string).format(
      'YYYY-MM-DD HH:mm:ss.SSS',
    );
    const formattedContext = context ? `[${context}]` : '';
    const formattedStack = stack ? `\n${stack}` : '';

    return `${formattedDate} ${level} ${formattedContext} ${message}${formattedStack}`;
  }),
);
