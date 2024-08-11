import { Inject, Injectable, Scope } from '@nestjs/common';
import * as bunyan from 'bunyan';
import { ILog } from './interface/log.interface';
import { LOGGER_INSTANCE } from './types';

@Injectable({
  scope: Scope.REQUEST,
})
export class AppLogger implements ILog {
  private readonly bunyanLog: bunyan;
  private _metadata: object = {};
  constructor(
    @Inject(LOGGER_INSTANCE)
    private readonly log,
  ) {
    this.bunyanLog = this.log;
  }

  public setContext(ctx: string): this {
    this._metadata = {
      ...this._metadata,
      ctx,
    };
    return this;
  }

  public error(message: string, error: Error, metadata?: object): void {
    this.bunyanLog.error(
      {
        error: error.stack,
        metadata,
      },
      message,
    );
  }

  public info(message: string, metadata?: object): void {
    this.bunyanLog.info(
      {
        ...this._metadata,
        metadata,
      },
      message,
    );
  }

  public warn(message: string, metadata?: object): void {
    this.bunyanLog.warn(
      {
        ...this._metadata,
        metadata,
      },
      message,
    );
  }

  public debug(message: string, metadata?: object): void {
    this.bunyanLog.debug(
      {
        ...this._metadata,
        metadata,
      },
      message,
    );
  }

  public trace(message: string, metadata?: object): void {
    this.bunyanLog.trace(
      {
        ...this._metadata,
        metadata,
      },
      message,
    );
  }
}
