import {
  ArgumentsHost,
  Catch,
  ExceptionFilter as NestExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { get as getProperty } from 'lodash';
import { BaseHttpException } from '../exceptions/base-http.exception';
import { ExceptionSerializer } from './serializers/exception.serializer';

@Catch()
export class ExceptionFilter implements NestExceptionFilter<BaseHttpException> {
  catch(exception: BaseHttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status =
      exception instanceof BaseHttpException
        ? exception.getStatus()
        : getProperty(
            exception,
            'response.code',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      Logger.error(exception.stack);
    }

    const serializedResponse = plainToClass(ExceptionSerializer, {
      code: status,
      details: getProperty(exception, 'response.details'),
    });
    const res = instanceToPlain(serializedResponse);
    Logger.log('HTTP ERROR RESPONSE', { res });
    response.status(status).json(res);
  }
}
