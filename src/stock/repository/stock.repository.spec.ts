import { Test, TestingModule } from "@nestjs/testing";
import { v4 as uuid } from "uuid";
import { StockRepository } from "./stock.repository";
import { StockEntity } from "../entities/stock.entity";
import { AppLogger } from "src/core/logger";
import { ObjectLiteral } from "src/common/interfaces/object-literal.interface";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ObjectId, UpdateResult } from "mongodb";
import { IUpdateFilter } from "../interfaces/stock-repository.interface";

class StockRepositoryFake {
  // eslint-disable-next-line
  async findOne() {}

  // eslint-disable-next-line
  async updateOne() {}
}

describe("StockRepository", () => {
  let stockRepository: StockRepository;
  let logger: AppLogger;
  let query: ObjectLiteral;
  let response: StockEntity;
  let productId: string;
  let warehouseId: string;
  let updateFilter: IUpdateFilter;
  let updateResult: UpdateResult;

  beforeEach(async () => {
    const mockLogger = {
      info: jest.fn(),
      setContext: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(StockEntity),
          useClass: StockRepositoryFake,
        },
        {
          provide: AppLogger,
          useValue: mockLogger,
        },
        StockRepository,
      ],
    }).compile();

    stockRepository = module.get(getRepositoryToken(StockEntity));
    logger = module.get<AppLogger>(AppLogger);
    jest.spyOn(logger, "setContext").mockImplementationOnce(() => null);

    productId = uuid();
    warehouseId = uuid();

    query = {
      productId,
      warehouseId,
    };

    updateFilter = {
      $set: { availability: 10 },
    };

    response = {
      availability: 100,
      productId,
      warehouseId: warehouseId,
      _id: new ObjectId("66b73d38f35d200000000001"),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    updateResult = {
      acknowledged: true,
      matchedCount: 1,
      modifiedCount: 1,
      upsertedCount: 0,
      upsertedId: new ObjectId("66b73d38f35d200000000002"),
    };
  });

  it("should be defined", () => {
    expect(stockRepository).toBeDefined();
  });

  describe("findOne", () => {
    it("should pass", async () => {
      let err, result;
      jest.spyOn(stockRepository, "findOne").mockResolvedValueOnce(response);
      try {
        result = await stockRepository.findOne(query);
      } catch (e) {
        err = e;
      } finally {
        expect(err).toBeUndefined();
        expect(result).toBeDefined();
        expect(result).toEqual(response);
        expect(stockRepository.findOne).toHaveBeenCalledTimes(1);
        expect(stockRepository.findOne).toHaveBeenCalledWith(query);
      }
    });
  });

  describe("updateOne", () => {
    it("should pass", async () => {
      let err, result;
      jest
        .spyOn(stockRepository, "updateOne")
        .mockResolvedValueOnce(updateResult);
      try {
        result = await stockRepository.updateOne(query, updateFilter);
      } catch (e) {
        err = e;
      } finally {
        expect(err).toBeUndefined();
        expect(result).toBeDefined();
        expect(result).toEqual(updateResult);
        expect(stockRepository.updateOne).toHaveBeenCalledTimes(1);
        expect(stockRepository.updateOne).toHaveBeenCalledWith(
          query,
          updateFilter,
        );
      }
    });
  });
});
