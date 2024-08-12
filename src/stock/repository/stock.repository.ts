import { Injectable } from "@nestjs/common";
import {
  IStockRepository,
  IUpdateFilter,
} from "../interfaces/stock-repository.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { StockEntity } from "../entities/stock.entity";
import { MongoRepository, Document, DataSource } from "typeorm";
import { AppLogger } from "src/core/logger";
import { ObjectLiteral } from "src/common/interfaces/object-literal.interface";
import { UpdateResult } from "mongodb";

@Injectable()
export class ProductStockRepository implements IStockRepository {
  constructor(
    @InjectRepository(StockEntity)
    private readonly stockRepository: MongoRepository<StockEntity>,
    private readonly logger: AppLogger,
    private readonly connection: DataSource,
  ) {
    this.logger.setContext(ProductStockRepository.name);
  }

  async findOne(query: ObjectLiteral): Promise<StockEntity> {
    return this.stockRepository.findOne({
      where: query,
    });
  }

  async updateOne(
    query: ObjectLiteral,
    updateFilter: IUpdateFilter,
  ): Promise<Document | UpdateResult> {
    return this.stockRepository.updateOne(query, updateFilter);
  }

  async findAndUpdateOneUsingTransactions(
    query: ObjectLiteral,
    productCount: number,
  ): Promise<number> {
    let newAvailability: number;
    const queryRunner = this.connection.createQueryRunner("master");

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const product = await this.findOne(query);
      newAvailability = product.availability - productCount;
      await this.updateOne(query, {
        $set: {
          availability: newAvailability,
          updatedAt: new Date(),
        },
      });

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
      return newAvailability;
    }
  }
}
