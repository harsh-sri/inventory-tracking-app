import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';
import docs from '../error-code.map';
import { ExceptionSerializer } from '../exception.serializer';

export class NotFoundErrorDocs extends ExceptionSerializer {
  get message(): string {
    return this._message;
  }

  @ApiHideProperty()
  static readonly description = docs[404].title;

  @ApiPropertyOptional({
    type: 'string',
    example: docs[404].code,
    enum: [docs[404].code],
    default: docs[404].code,
  })
  code: string;

  @ApiPropertyOptional({
    type: 'string',
    example: docs[404].message,
    enum: [docs[404].message],
    default: docs[404].message,
  })
  private _message: string;
}
