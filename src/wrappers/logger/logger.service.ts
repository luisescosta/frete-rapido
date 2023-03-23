import { Injectable } from '@nestjs/common';
import { ILoggerWrapper, LogProps } from './interfaces';
@Injectable()
export class LoggerWrapper implements ILoggerWrapper {
  async execute(props: LogProps): Promise<void> {
    const { message, error } = props;
    const params = {
      message,
      ...(error && { error }),
    };
    console.log({ params });
  }
}
