import { HttpException } from '@nestjs/common';
import { IBaseHttpExceptionOptions } from './interfaces/base-exception-options.interface';

export class BaseHttpException extends HttpException {
  constructor(options: IBaseHttpExceptionOptions) {
    super(
      {
        details: options.details,
        message: options.message,
      },
      options.httpStatusCode,
    );
  }
}
