import { v4 as uuid } from "uuid";
import { Test, TestingModule } from "@nestjs/testing";
import { HttpStatusCodes } from "src/common/enums/http-status-codes.enum";
import { StockService } from "./stock.service";
import { AppLogger } from "src/core/logger";
import { UpdateStockDto } from "../dto/update-stock.dto";
import { HttpResponseMessage } from "src/common/enums/response-message.enum";
import { NotificationService } from "src/notification/notification.service";
import { ProductStockRepository } from "../repository/stock.repository";

describe("StockService", () => {
  let service: StockService;
  let mockStockRepository;
  let logger: AppLogger;
  let payload: UpdateStockDto;
  let productId;
  let response;

  beforeEach(async () => {
    // setting up mocks
    const mockLogger = {
      info: jest.fn(),
      setContext: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    };

    mockStockRepository = {
      findOne: jest.fn(),
      updateOne: jest.fn(),
      findAndUpdateOneUsingTransactions: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AppLogger,
          useValue: mockLogger,
        },
        {
          provide: ProductStockRepository,
          useValue: mockStockRepository,
        },
        {
          provide: NotificationService,
          useValue: {
            sendProductAvailabilityNotifSync: jest.fn(),
            sendProductAvailabilityNotifAsync: jest.fn(),
          },
        },
        StockService,
      ],
    }).compile();

    service = module.get<StockService>(StockService);
    logger = module.get<AppLogger>(AppLogger);
    jest.spyOn(logger, "setContext").mockImplementationOnce(() => null);
    jest.spyOn(logger, "error").mockImplementationOnce(() => null);

    // request data
    productId = uuid();
    payload = {
      warehouseId: uuid(),
      productCount: 10,
    };

    // response
    response = {
      availability: 100,
      productId,
      warehouseId: payload?.warehouseId,
      _id: "66b73d38f35d200000000001",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", async () => {
    expect(service).toBeDefined();
  });

  describe("isStockAvailable", () => {
    it("should return true if availability is > 0", async () => {
      let err, result;
      try {
        result = service.isStockAvailable(10);
      } catch (e) {
        err = e;
      } finally {
        expect(err).toBeUndefined();
        expect(result).toBeDefined();
        expect(result).toEqual(true);
      }
    });

    it("should return false if availability is <= 0", async () => {
      let err, result;
      try {
        result = service.isStockAvailable(0);
      } catch (e) {
        err = e;
      } finally {
        expect(err).toBeUndefined();
        expect(result).toBeDefined();
        expect(result).toEqual(false);
      }
    });
  });

  describe("isStockPartiallyAvailable", () => {
    it("should return true if availability < productCount", async () => {
      let err, result;
      try {
        result = service.isStockPartiallyAvailable(10, 1);
      } catch (e) {
        err = e;
      } finally {
        expect(err).toBeUndefined();
        expect(result).toBeDefined();
        expect(result).toEqual(true);
      }
    });

    it("should return false if availability > productCount", async () => {
      let err, result;
      try {
        result = service.isStockPartiallyAvailable(2, 10);
      } catch (e) {
        err = e;
      } finally {
        expect(err).toBeUndefined();
        expect(result).toBeDefined();
        expect(result).toEqual(false);
      }
    });
  });

  describe("patch", () => {
    it("should successfully update the product stock", async () => {
      const updatedAvailability = response.availability - payload.productCount;
      jest
        .spyOn(mockStockRepository, "findOne")
        .mockResolvedValueOnce(response);
      jest
        .spyOn(service, "isStockPartiallyAvailable")
        .mockReturnValueOnce(false);
      jest.spyOn(service, "isStockAvailable").mockReturnValueOnce(true);

      jest.spyOn(mockStockRepository, "updateOne").mockResolvedValueOnce({
        ...response,
        availability: updatedAvailability,
      });
      let err, result;
      try {
        result = await service.patch(productId, payload);
      } catch (e) {
        err = e;
      } finally {
        expect(err).toBeUndefined();
        expect(result).toBeDefined();
        expect(result.code).toBeDefined();
        expect(result.code).toEqual(
          HttpStatusCodes.SUCCESS_CODE_CREATED_OR_UPDATED,
        );
        expect(result.message).toBeDefined();
        expect(result.message).toEqual(HttpResponseMessage.SUCCESS);
        expect(result.productStockData).toBeDefined();
        expect(result.productStockData.availability).toBeDefined();
        expect(result.productStockData.availability).toEqual(
          updatedAvailability,
        );
      }
    });

    it("[Out Of Stock]should throw an error", async () => {
      response.availability = 0;
      jest
        .spyOn(mockStockRepository, "findOne")
        .mockResolvedValueOnce(response);
      jest.spyOn(service, "isStockAvailable").mockReturnValueOnce(false);

      let err, result;
      try {
        result = await service.patch(productId, payload);
      } catch (e) {
        err = e;
      } finally {
        expect(err).toBeDefined();
        expect(result).toBeUndefined();
        expect(err.status).toBeDefined();
        expect(err.status).toEqual(HttpStatusCodes.FAILED);
        expect(err.response.details.message).toBeDefined();
        expect(err.response.details.message).toEqual(
          HttpResponseMessage.NO_AVAILABILITY,
        );
        expect(err.response.message).toBeDefined();
        expect(err.response.message).toEqual(
          HttpResponseMessage.NO_AVAILABILITY,
        );
      }
    });

    it("[Partial Stock Availability]should return partial stock available msg with 400 bad request", async () => {
      response.availability = 2;
      jest
        .spyOn(mockStockRepository, "findOne")
        .mockResolvedValueOnce(response);
      jest.spyOn(service, "isStockAvailable").mockReturnValueOnce(true);
      jest
        .spyOn(service, "isStockPartiallyAvailable")
        .mockReturnValueOnce(true);

      let err, result;
      try {
        result = await service.patch(productId, payload);
      } catch (e) {
        err = e;
      } finally {
        expect(err).toBeUndefined();
        expect(result).toBeDefined();
        expect(result.code).toBeDefined();
        expect(result.code).toEqual(HttpStatusCodes.FAILED);
        expect(result.message).toBeDefined();
        expect(result.message).toEqual(
          HttpResponseMessage.PARTIAL_AVAILABILITY.replace(
            "{number}",
            response.availability.toString(),
          ),
        );
        expect(result.productStockData.availability).toBeDefined();
        expect(result.productStockData.availability).toEqual(2);
      }
    });
  });

  describe("patchV2", () => {
    it("should successfully update the product stock using transactions", async () => {
      const updatedAvailability = response.availability - payload.productCount;
      jest
        .spyOn(mockStockRepository, "findOne")
        .mockResolvedValueOnce(response);
      jest.spyOn(service, "validateStock").mockResolvedValueOnce({
        isPartialStock: false,
        availability: 100,
      });

      jest
        .spyOn(mockStockRepository, "findAndUpdateOneUsingTransactions")
        .mockResolvedValueOnce(updatedAvailability);
      let err, result;
      try {
        result = await service.patchV2(productId, payload);
      } catch (e) {
        err = e;
      } finally {
        expect(err).toBeUndefined();
        expect(result).toBeDefined();
        expect(result.code).toBeDefined();
        expect(result.code).toEqual(
          HttpStatusCodes.SUCCESS_CODE_CREATED_OR_UPDATED,
        );
        expect(result.message).toBeDefined();
        expect(result.message).toEqual(HttpResponseMessage.SUCCESS);
        expect(result.productStockData).toBeDefined();
        expect(result.productStockData.availability).toBeDefined();
        expect(result.productStockData.availability).toEqual(
          updatedAvailability,
        );
      }
    });
  });
});
