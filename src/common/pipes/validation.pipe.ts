import {
  ArgumentMetadata,
  Injectable,
  Type,
  ValidationPipe as NestJsValidationPipe,
} from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { map } from "lodash";
import { BadRequestException } from "../exceptions/bad-request.exception";
import { IBaseHttpExceptionDetails } from "../exceptions/interfaces/base-exception-details.interface";

@Injectable()
export class ValidationPipe extends NestJsValidationPipe {
  constructor(args?) {
    super(args);
  }

  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.canValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);

    const errors: ValidationError[] = await validate(object);

    if (errors.length > 0) {
      throw new BadRequestException({
        details: this.formatErrorMessages(errors),
      });
    }
    return object;
  }

  private canValidate(metatype: Type<any>): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find((type) => metatype === type);
  }

  private formatErrorMessages(
    errors: ValidationError[],
    accumulator = {},
    objectPath = "",
  ): IBaseHttpExceptionDetails {
    return errors.reduce((acc, error: ValidationError) => {
      const originalProperty = error.property;

      if (objectPath) {
        if (typeof error.target === "function") {
          error.property = objectPath;
        } else {
          error.property = `${objectPath}.${error.property}`;
        }
      }

      if (error.constraints) {
        acc[error.property] = map(error.constraints, (value: string) => {
          return value.replace(`${originalProperty} `, "");
        }).join(", ");
      }

      if (error.children) {
        return this.formatErrorMessages(error.children, acc, error.property);
      }

      return acc;
    }, accumulator);
  }
}
