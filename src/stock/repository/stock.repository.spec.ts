import { Test, TestingModule } from "@nestjs/testing";
import { v4 as uuid } from "uuid";
import { StockEntity } from "../entities/stock.entity";
import { AppLogger } from "src/core/logger";
import { ObjectLiteral } from "src/common/interfaces/object-literal.interface";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ObjectId, UpdateResult } from "mongodb";
import { IUpdateFilter } from "../interfaces/stock-repository.interface";
import { DataSource, MongoRepository, QueryRunner } from "typeorm";
import { ProductStockRepository } from "./stock.repository";

class StockRepositoryFake {
  // eslint-disable-next-line
  async findOne() {}

  // eslint-disable-next-line
  async updateOne() {}
}

describe("StockRepository", () => {
  let stockRepository: MongoRepository<StockEntity>;
  let productStockRepoService: ProductStockRepository;
  let logger: AppLogger;
  let query: ObjectLiteral;
  let response: StockEntity;
  let productId: string;
  let warehouseId: string;
  let updateFilter: IUpdateFilter;
  let updateResult: UpdateResult;
  let mockConnection: DataSource;
  let mockQueryRunner: QueryRunner;

  beforeEach(async () => {
    const mockLogger = {
      info: jest.fn(),
      setContext: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    };

    mockQueryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
    } as any;

    mockConnection = {
      createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
    } as any;
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
        { provide: DataSource, useValue: mockConnection },
        ProductStockRepository,
      ],
    }).compile();

    stockRepository = module.get(getRepositoryToken(StockEntity));
    productStockRepoService = module.get<ProductStockRepository>(
      ProductStockRepository,
    );
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
    expect(productStockRepoService).toBeDefined();
  });

  describe("findOne", () => {
    it("should pass", async () => {
      let err, result;
      jest.spyOn(stockRepository, "findOne").mockResolvedValueOnce(response);
      try {
        result = await productStockRepoService.findOne(query);
      } catch (e) {
        err = e;
      } finally {
        expect(err).toBeUndefined();
        expect(result).toBeDefined();
        expect(result).toEqual(response);
        expect(stockRepository.findOne).toHaveBeenCalledTimes(1);
        expect(stockRepository.findOne).toHaveBeenCalledWith({ where: query });
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
        result = await productStockRepoService.updateOne(query, updateFilter);
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

  describe("findAndUpdateOneUsingTransactions", () => {
    it("should find, update and return new availability", async () => {
      const query = {
        productId: "someProductId",
        warehouseId: "someWarehouseId",
      };
      const productCount = 2;
      const product = new StockEntity();
      product.availability = 10;

      jest.spyOn(stockRepository, "findOne").mockResolvedValueOnce(product);
      jest.spyOn(stockRepository, "updateOne").mockResolvedValueOnce({});
      let err, result;

      try {
        result =
          await productStockRepoService.findAndUpdateOneUsingTransactions(
            query,
            productCount,
          );
      } catch (e) {
        err = e;
      } finally {
        expect(err).toBeUndefined();
        expect(result).toBeDefined();
        expect(result).toBe(8);
        expect(mockQueryRunner.connect).toHaveBeenCalled();
        expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
        expect(stockRepository.findOne).toHaveBeenCalledWith({ where: query });
        expect(stockRepository.updateOne).toHaveBeenCalledWith(query, {
          $set: {
            availability: 8,
            updatedAt: expect.any(Date),
          },
        });
        expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
        expect(mockQueryRunner.release).toHaveBeenCalled();
      }
    });
  });
});
