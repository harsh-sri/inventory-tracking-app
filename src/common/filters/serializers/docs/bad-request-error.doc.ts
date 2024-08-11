import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';
import docs from '../error-code.map';
import { ExceptionSerializer } from '../exception.serializer';

export class BadRequestErrorDocs extends ExceptionSerializer {
  get message(): string {
    return this._message;
  }

  @ApiHideProperty()
  static readonly description = docs[400].title;

  @ApiPropertyOptional({
    type: 'string',
    example: docs[400].code,
    enum: [docs[400].code],
    default: docs[400].code,
  })
  code: string;

  @ApiPropertyOptional({
    type: 'string',
    example: docs[400].message,
    enum: [docs[400].message],
    default: docs[400].message,
  })
  private _message: string;
}
