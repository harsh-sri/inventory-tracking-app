import { IBaseHttpExceptionDetails } from './base-exception-details.interface';

export interface IBaseHttpExceptionOptions {
  details?: IBaseHttpExceptionDetails;
  message?: string;
  httpStatusCode?: number;
}
