import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { HttpStatusCodes } from "src/common/enums/http-status-codes.enum";
import { HttpResponseMessage } from "src/common/enums/response-message.enum";
import { UpdateStockResponse } from "./update-stock-response.class";

export class BaseResponse {
  @ApiHideProperty()
  @Exclude()
  static readonly _description = "Inventory Tracking API Response";

  constructor(partial: Partial<BaseResponse>) {
    Object.assign(this, partial);
  }

  @ApiProperty({
    type: "number",
    title: "Http Response Code",
    enum: [
      HttpStatusCodes.SUCCESS_CODE_CREATED_OR_UPDATED,
      HttpStatusCodes.FAILED,
      HttpStatusCodes.SUCCESS_CODE_OK,
      HttpStatusCodes.NOT_FOUND,
      HttpStatusCodes.UNEXPECTED_ERROR,
    ],
    example: HttpStatusCodes.SUCCESS_CODE_CREATED_OR_UPDATED,
    required: true,
  })
  code: number;

  @ApiProperty({
    type: "string",
    title: "Response Message",
    enum: [
      HttpResponseMessage.SUCCESS,
      HttpResponseMessage.FAILED,
      HttpResponseMessage.UPDATED,
      HttpResponseMessage.CREATED,
      HttpResponseMessage.NOT_FOUND,
    ],
    example: HttpResponseMessage.SUCCESS,
    required: true,
  })
  message: string;

  @ApiProperty({
    type: UpdateStockResponse,
    title: "Update Stock",
    example: `{availability: 100}`,
    required: false,
  })
  productStockData: UpdateStockResponse;
}
