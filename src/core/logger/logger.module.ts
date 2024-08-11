import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '../config';
import * as bunyan from 'bunyan';
import { AppLogger } from './logger';
import { LOGGER_INSTANCE } from './types';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: LOGGER_INSTANCE,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const { name, level } = configService.log;

        const bunyanLog: bunyan = bunyan.createLogger({
          level,
          name,
          streams: [
            {
              // stdout
              stream: process.stdout,
            },
          ],
        });

        return bunyanLog;
      },
    },
    AppLogger,
  ],
  exports: [AppLogger],
})
export class LoggerModule {}
