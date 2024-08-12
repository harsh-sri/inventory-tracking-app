import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Param,
  Patch,
  UseInterceptors,
} from "@nestjs/common";
import { ApiCreatedResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { BaseController } from "src/common/controllers/base.controller";
import { StockService } from "../services/stock.service";
import { AppLogger } from "src/core/logger";
import { BaseResponse } from "../serializers/base-response.class";
import { ProductIdDto } from "../dto/product-id.dto";
import { ValidationPipe } from "src/common/pipes";
import { UpdateStockDto } from "../dto/update-stock.dto";
import { updateStockTags } from "src/common/docs/constants";

@ApiTags(...updateStockTags)
@Controller()
export class UpdateStockController extends BaseController {
  constructor(
    private readonly service: StockService,
    private readonly logger: AppLogger,
  ) {
    super();
    this.logger.setContext(UpdateStockController.name);
  }

  @Patch("/v1/stock/:productId")
  @ApiOperation({
    operationId: "updateStock",
    summary: "UPDATE",
    description: "update stock of a given product",
  })
  @ApiCreatedResponse({
    description: BaseResponse._description,
    type: BaseResponse,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  async patch(
    @Param() productId: ProductIdDto,
    @Body(new ValidationPipe()) updateStockDto: UpdateStockDto,
  ): Promise<BaseResponse> {
    try {
      const validationPipe = new ValidationPipe();
      const validatedProductId: ProductIdDto = await validationPipe.transform(
        productId,
        {
          type: "custom",
          metatype: ProductIdDto,
        },
      );

      return this.service.patch(validatedProductId, updateStockDto);
    } catch (e) {
      throw e;
    }
  }

  @Patch("/v2/stock/:productId")
  @ApiOperation({
    operationId: "updateStock",
    summary: "UPDATE",
    description: "update stock of a given product using transactions",
  })
  @ApiCreatedResponse({
    description: BaseResponse._description,
    type: BaseResponse,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  async patchV2(
    @Param() productId: ProductIdDto,
    @Body(new ValidationPipe()) updateStockDto: UpdateStockDto,
  ): Promise<BaseResponse> {
    try {
      const validationPipe = new ValidationPipe();
      const validatedProductId: ProductIdDto = await validationPipe.transform(
        productId,
        {
          type: "custom",
          metatype: ProductIdDto,
        },
      );

      return this.service.patchV2(validatedProductId, updateStockDto);
    } catch (e) {
      throw e;
    }
  }
}
