// testing logger winston service, not append to mail project
// due to errors and unknown finish code... babel afterwork video
// https://youtu.be/t_cUQ9OfdMg?list=LL

import * as dotenv from 'dotenv';
import * as winston from 'winston';
import * as fs from 'fs';
import * as WinstonRotateFile from 'winston-daily-rotate-file';
import { Optional, Injectable } from '@nestjs/common';
import * as clc from 'cli-color';

dotenv.config();

declare const process: any;
const yellow = clc.xterm(3);

export interface LoggerService {
  log(message: any, context?: string);
  error(message: any, trace?: string, context?: string);
  warn(message: any, context?: string);
  debug?(message: any, context?: string);
  verbose?(message: any, context?: string);
}

@Injectable()
export class Logger implements LoggerService {
  private logLevel = process.env.LOG_LEVEL;
  private logDir = 'log';

  private logger: winston.Logger;

  private loggerOptions: winston.LoggerOptions = {
    exitOnError: false,
    level: this.logLevel,
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
    ),
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.prettyPrint(),
          winston.format.printf(
            info => `${info.timestamp} ${info.level}: ${info.message}`,
          ),
        ),
      }),
      new WinstonRotateFile({
        format: winston.format.combine(
          winston.format.prettyPrint(),
          winston.format.json(),
        ),
        filename: `${this.logDir}/%DATE%-general.log`,
        datePattern: 'YYYY-MM-DD',
      }),
    ],
  };

  private static lastTimestamp?: number;
  private static instance?: typeof Logger | LoggerService = Logger;

  constructor(
    @Optional() private readonly context?: string,
    @Optional() private readonly isTimestampEnabled = false,
  ) {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir);
    }

    this.logger = winston.createLogger(this.loggerOptions);
  }

  error(message: any, trace = '', context?: string) {
    const instance = this.getInstance();
//    instance &&
//      instance.error.call(instance, message, trace, context || this.context);

    this.logger.error(`${message} -> (${trace} || 'trace not found!)`, {
      timestamp: new Date().toISOString(),
    });
  }

  log(message: any, context?: string) {
    this.callFunction('log', message, context);

    this.logger.info(`${message} -> (${context} || 'trace not found!)`, {
      timestamp: new Date().toISOString(),
    });
  }

  warn(message: any, context?: string) {
    this.callFunction('warn', message, context);
  }

  debug(message: any, context?: string) {
    this.callFunction('debug', message, context);
  }

  verbose(message: any, context?: string) {
    this.callFunction('verbose', message, context);
  }

  static overrideLogger(logger: LoggerService | boolean) {
    this.instance =
      logger !== null && typeof logger === 'object'
        ? (logger as LoggerService)
        : undefined;
  }

  static log(message: any, context = '', isTimeDiffEnabled = true) {
    //this.printMessage(message, clc.green, context, isTimeDiffEnabled);
  }

  private getInstance() {
    return Logger.instance;
  }

  private callFunction(level: string, message: string, context?: string) {
    return;
  }

  private printMessage(
    message: any,
    color: any,
    context: any,
    osTimeDiffEnabled: boolean,
  ) {
    console.log('ddd');
  }
}
