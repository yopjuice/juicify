import { ConsoleLogger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'node:path';

export class MyLogger extends ConsoleLogger {
  error(message: any, stack?: string, context?: string) {
    const logMessage = `${new Date().toISOString()} - ${context || 'unknown'} - ${message}\n`;
    fs.appendFileSync(path.resolve('log.txt'), logMessage);
    super.error(message, stack, context);
  }

}