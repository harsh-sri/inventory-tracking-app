import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { get as _get } from 'lodash';
import codeTypeMap from './error-code.map';

export class ExceptionSerializer {
  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: {
      type: 'object',
    },
  })
  @Expose()
  details: object;

  @ApiPropertyOptional({
    description: 'Error timestamp',
    example: 143527794329,
    type: 'number',
  })
  @Expose()
  get timestamp(): number {
    return new Date().getTime();
  }

  @Expose()
  code?: string;

  @Expose()
  get message(): string {
    return _get(codeTypeMap, `${this.code}.message`, codeTypeMap[500].message);
  }
}
