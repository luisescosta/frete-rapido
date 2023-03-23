export type LogProps = {
  message: string;
  error?: any;
};

export interface ILoggerWrapper {
  execute(props: LogProps): Promise<void>;
}

export const ILoggerWrapper = Symbol('ILoggerWrapper');
