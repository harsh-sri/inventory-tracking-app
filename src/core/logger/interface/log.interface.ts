export interface ILog {
  error: (message: string, error: Error, metadata?: object) => void;
  warn: (message: string, metadata?: object) => void;
  info: (message: string, metadata?: object) => void;
  debug: (message: string, metadata?: object) => void;
  trace: (message: string, metadata?: object) => void;
  setContext: (ctx: string) => this;
}
