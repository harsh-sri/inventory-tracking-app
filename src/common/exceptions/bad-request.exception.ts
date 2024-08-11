import { HttpStatus } from '@nestjs/common';
import { BaseHttpException } from './base-http.exception';
import { IBaseHttpExceptionOptions } from './interfaces/base-exception-options.interface';

export class BadRequestException extends BaseHttpException {
  constructor(options: IBaseHttpExceptionOptions) {
    super({
      details: options.details,
      message: options.message,
      httpStatusCode: HttpStatus.BAD_REQUEST,
    });
  }
}
