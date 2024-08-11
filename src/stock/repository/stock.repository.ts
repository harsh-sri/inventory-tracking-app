import { Injectable } from "@nestjs/common";
import {
  IStockRepository,
  IUpdateFilter,
} from "../interfaces/stock-repository.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { StockEntity } from "../entities/stock.entity";
import { MongoRepository, Document } from "typeorm";
import { AppLogger } from "src/core/logger";
import { ObjectLiteral } from "src/common/interfaces/object-literal.interface";
import { UpdateResult } from "mongodb";

@Injectable()
export class StockRepository implements IStockRepository {
  constructor(
    @InjectRepository(StockEntity)
    private readonly stockRepository: MongoRepository<StockEntity>,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(StockRepository.name);
  }

  async findOne(query: ObjectLiteral): Promise<StockEntity> {
    return this.stockRepository.findOne(query);
  }

  async updateOne(
    query: ObjectLiteral,
    updateFilter: IUpdateFilter,
  ): Promise<Document | UpdateResult> {
    return this.stockRepository.updateOne(query, updateFilter);
  }
}
