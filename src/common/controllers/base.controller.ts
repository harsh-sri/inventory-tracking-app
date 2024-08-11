import { UseFilters } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiServiceUnavailableResponse,
  ApiTags,
} from "@nestjs/swagger";
import { ExceptionFilter } from "../filters/exception.filter";

import {
  BadRequestErrorDocs,
  InternalErrorDocs,
  NotFoundErrorDocs,
  ServiceUnavailableErrorDocs,
} from "../filters/serializers/docs";

@ApiBadRequestResponse({
  description: BadRequestErrorDocs.description,
  type: BadRequestErrorDocs,
})
@ApiNotFoundResponse({
  description: NotFoundErrorDocs.description,
  type: NotFoundErrorDocs,
})
@ApiInternalServerErrorResponse({
  description: InternalErrorDocs.description,
  type: InternalErrorDocs,
})
@ApiServiceUnavailableResponse({
  description: ServiceUnavailableErrorDocs.description,
  type: ServiceUnavailableErrorDocs,
})
@ApiTags("Inventory/Stock Tracker Service")
@UseFilters(new ExceptionFilter())
export class BaseController {}
