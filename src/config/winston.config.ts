import { format, transports, LoggerOptions } from 'winston';
import 'winston-daily-rotate-file';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import { winstonLoggerFormat } from './logger.format';

export const winstonConfig: LoggerOptions = {
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winstonLoggerFormat,
  transports: [
    new transports.Console({
      format: format.combine(
        format((info) => {
          const nestLikeFormat = nestWinstonModuleUtilities.format.nestLike(
            'App',
            {
              colors: true,
              prettyPrint: true,
            },
          );

          const transformedInfo = nestLikeFormat.transform({
            ...info,
            context: info.context || 'App',
          });

          if (transformedInfo) {
            const formattedMessage = transformedInfo[Symbol.for('message')];
            if (formattedMessage) {
              info.level = formattedMessage.split(' ')[0];
            }
          }
          return info;
        })(),
        winstonLoggerFormat,
      ),
    }),
    new transports.DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: format.combine(format.uncolorize()),
    }),
  ],
  exceptionHandlers: [
    new transports.File({
      filename: 'logs/exceptions.log',
      format: format.combine(format.uncolorize()),
    }),
  ],
  rejectionHandlers: [
    new transports.File({
      filename: 'logs/rejections.log',
      format: format.combine(format.uncolorize()),
    }),
  ],
};
