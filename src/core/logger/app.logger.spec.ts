import { Test, TestingModule } from '@nestjs/testing';
import { AppLogger } from './logger';
import { ConfigModule, ConfigService } from '../config';
import { LOGGER_INSTANCE } from './types';

const mockLogger = {
  error: jest.fn(),
  info: jest.fn(),
  trace: jest.fn(),
  debug: jest.fn(),
  warn: jest.fn(),
};

describe('App Logger', () => {
  let appLogger: AppLogger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppLogger,
        ConfigService,
        {
          provide: LOGGER_INSTANCE,
          useFactory: () => {},
          inject: [ConfigService],
          useValue: mockLogger,
        },
      ],
      imports: [ConfigModule],
    }).compile();

    appLogger = await module.resolve<AppLogger>(AppLogger);
  });

  it('should be defined', async () => {
    expect(appLogger).toBeDefined();
  });

  describe('info method', () => {
    it('should call info method', async () => {
      const metadata = {
        msg: 'something went wrong',
      };
      appLogger.info('test message', metadata);
      expect(mockLogger.info).toHaveBeenCalledTimes(1);
    });
  });

  describe('error method', () => {
    it('should call error method', async () => {
      const metadata = {
        msg: 'something went wrong',
      };
      appLogger.error('test message', new Error('exception'), metadata);
      expect(mockLogger.error).toHaveBeenCalledTimes(1);
    });
  });

  describe('warn method', () => {
    it('should call warn method', async () => {
      const metadata = {
        msg: 'something went wrong',
      };
      appLogger.warn('test message', metadata);
      expect(mockLogger.warn).toHaveBeenCalledTimes(1);
    });
  });

  describe('trace method', () => {
    it('should call trace method', async () => {
      const metadata = {
        msg: 'something went wrong',
      };
      appLogger.trace('test message', metadata);
      expect(mockLogger.trace).toHaveBeenCalledTimes(1);
    });
  });

  describe('debug method', () => {
    it('should call debug method', async () => {
      const metadata = {
        msg: 'something went wrong',
      };
      appLogger.debug('test message', metadata);
      expect(mockLogger.debug).toHaveBeenCalledTimes(1);
    });
  });
});
