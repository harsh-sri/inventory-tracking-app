import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';
import docs from '../error-code.map';
import { ExceptionSerializer } from '../exception.serializer';

export class InternalErrorDocs extends ExceptionSerializer {
  get message(): string {
    return this._message;
  }

  @ApiHideProperty()
  static readonly description = docs[500].title;

  @ApiPropertyOptional({
    type: 'string',
    example: docs[500].code,
    enum: [docs[500].code],
    default: docs[500].code,
  })
  code: string;

  @ApiPropertyOptional({
    type: 'string',
    example: docs[500].message,
    enum: [docs[500].message],
    default: docs[500].message,
  })
  private _message: string;
}
