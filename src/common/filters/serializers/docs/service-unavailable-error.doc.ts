import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';
import docs from '../error-code.map';
import { ExceptionSerializer } from '../exception.serializer';

export class ServiceUnavailableErrorDocs extends ExceptionSerializer {
  get message(): string {
    return this._message;
  }

  @ApiHideProperty()
  static readonly description = docs[503].title;

  @ApiPropertyOptional({
    type: 'string',
    example: docs[503].code,
    enum: [docs[503].code],
    default: docs[503].code,
  })
  code: string;

  @ApiPropertyOptional({
    type: 'string',
    example: docs[503].message,
    enum: [docs[503].message],
    default: docs[503].message,
  })
  private _message: string;
}
