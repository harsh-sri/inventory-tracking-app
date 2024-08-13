import { Injectable } from "@nestjs/common";
import { AppLogger } from "src/core/logger";
import { UpdateStockDto } from "../dto/update-stock.dto";
import { BadRequestException } from "src/common/exceptions/bad-request.exception";
import { HttpStatusCodes } from "src/common/enums/http-status-codes.enum";
import { HttpResponseMessage } from "src/common/enums/response-message.enum";
import { BaseResponse } from "../serializers/base-response.class";
import { ProductIdDto } from "../dto/product-id.dto";
import { NotFoundException } from "src/common/exceptions/not-found.exception";
import { NotificationService } from "src/notification/notification.service";
import { StockEntity } from "../entities/stock.entity";
import { IValidStockResponse } from "../interfaces/stock.interface";
import { ProductStockRepository } from "../repository/stock.repository";

@Injectable()
export class StockService {
  constructor(
    private readonly stockRepository: ProductStockRepository,
    private readonly logger: AppLogger,
    private readonly notificationService: NotificationService,
  ) {
    this.logger.setContext(StockService.name);
  }

  isStockAvailable(availability: number): boolean {
    return availability > 0;
  }

  isStockPartiallyAvailable(
    productCount: number,
    availability: number,
  ): boolean {
    return productCount > availability;
  }

  async findStock(
    productIdDto: ProductIdDto,
    updateStockDto: UpdateStockDto,
  ): Promise<StockEntity> {
    const productId = productIdDto.productId;
    // 1. fetch product stock data from db
    const { warehouseId } = updateStockDto;

    const productStock = await this.stockRepository.findOne({
      productId: productId,
      warehouseId,
    });

    this.logger.debug("product stock", productStock);

    return productStock;
  }

  async validateStock(
    productIdDto: ProductIdDto,
    updateStockDto: UpdateStockDto,
  ): Promise<IValidStockResponse> {
    const { productCount } = updateStockDto;
    const productStock = await this.findStock(productIdDto, updateStockDto);

    if (!productStock) {
      throw new NotFoundException({
        message: HttpResponseMessage.NOT_FOUND,
        httpStatusCode: HttpStatusCodes.FAILED,
        details: {
          message: `stock with productId ${productIdDto.productId} and warehouseId: ${updateStockDto.warehouseId} does not exist`,
        },
      });
    }
    const { availability } = productStock;

    if (!this.isStockAvailable(availability)) {
      throw new BadRequestException({
        message: HttpResponseMessage.NO_AVAILABILITY,
        httpStatusCode: HttpStatusCodes.FAILED,
        details: {
          message: HttpResponseMessage.NO_AVAILABILITY,
        },
      });
    } else if (this.isStockPartiallyAvailable(productCount, availability)) {
      return {
        availability,
        isPartialStock: true,
      };
    }

    return {
      availability,
      isPartialStock: false,
    };
  }

  /**
   *
   * @param productId
   * @param updateStockDto
   * @returns
   *
   * v1 patch: updating inventory without trasactions and sending notification synchronously
   */
  async patch(
    productId: ProductIdDto,
    updateStockDto: UpdateStockDto,
  ): Promise<BaseResponse> {
    try {
      const prodId = productId.productId;
      // 1. fetch product stock data from db
      const { warehouseId, productCount } = updateStockDto;
      this.logger.debug("request payload", {
        warehouseId,
        productId: prodId,
        productCount,
      });
      const productStock = await this.stockRepository.findOne({
        productId: prodId,
        warehouseId,
      });

      this.logger.debug("product stock", productStock);

      if (!productStock) {
        throw new NotFoundException({
          message: HttpResponseMessage.NOT_FOUND,
          httpStatusCode: HttpStatusCodes.FAILED,
          details: {
            message: `stock with productId ${prodId} and warehouseId: ${warehouseId} does not exist`,
          },
        });
      }

      const { availability } = productStock;

      // 2. validate if availability is greator than 0 & request product count
      if (!this.isStockAvailable(availability)) {
        throw new BadRequestException({
          message: HttpResponseMessage.NO_AVAILABILITY,
          httpStatusCode: HttpStatusCodes.FAILED,
          details: {
            message: HttpResponseMessage.NO_AVAILABILITY,
          },
        });
      } else if (this.isStockPartiallyAvailable(productCount, availability)) {
        // Assumption, do not allow partial update.
        return new BaseResponse({
          code: HttpStatusCodes.FAILED,
          message: HttpResponseMessage.PARTIAL_AVAILABILITY.replace(
            "{number}",
            availability.toString(),
          ),
          productStockData: {
            availability,
          },
        });
      }

      // 3. Stock is available, We can deduct the productCount from availability
      const newAvailability = availability - productCount;

      // 4. update the stock in db
      // TODO: transactions
      await this.stockRepository.updateOne(
        { productId: prodId, warehouseId },
        { $set: { availability: newAvailability, updatedAt: new Date() } },
      );

      // 5. send notification async manner. Notification service will check threshold value
      this.notificationService.sendProductAvailabilityNotifSync({
        availability: newAvailability,
        productId: prodId,
      });
      // 6. return response
      return new BaseResponse({
        code: HttpStatusCodes.SUCCESS_CODE_CREATED_OR_UPDATED,
        message: HttpResponseMessage.SUCCESS,
        productStockData: {
          availability: newAvailability,
        },
      });
    } catch (e) {
      this.logger.error("something went wrong", e);
      throw e;
    }
  }

  /**
   *
   * @param productId
   * @param updateStockDto
   * @returns
   *
   * v1 patch: updating inventory without trasactions and sending notification async
   */
  async patchV2(
    productIdDto: ProductIdDto,
    updateStockDto: UpdateStockDto,
  ): Promise<BaseResponse> {
    try {
      const productId = productIdDto.productId;
      const { warehouseId, productCount } = updateStockDto;
      this.logger.debug("request payload patchV2", {
        warehouseId,
        productId: productId,
        productCount,
      });

      const { isPartialStock, availability } = await this.validateStock(
        productIdDto,
        updateStockDto,
      );

      if (isPartialStock) {
        return new BaseResponse({
          code: HttpStatusCodes.FAILED,
          message: HttpResponseMessage.PARTIAL_AVAILABILITY.replace(
            "{number}",
            availability.toString(),
          ),
          productStockData: {
            availability,
          },
        });
      }

      const newAvailability =
        await this.stockRepository.findAndUpdateOneUsingTransactions(
          { productId: productId, warehouseId },
          productCount,
        );

      await this.notificationService.sendProductAvailabilityNotifAsync({
        availability: newAvailability,
        productId,
      });

      return new BaseResponse({
        code: HttpStatusCodes.SUCCESS_CODE_CREATED_OR_UPDATED,
        message: HttpResponseMessage.SUCCESS,
        productStockData: {
          availability: newAvailability,
        },
      });
    } catch (e) {
      this.logger.error("something went wrong", e);
      throw e;
    }
  }
}
