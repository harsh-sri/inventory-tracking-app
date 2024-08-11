import { ObjectLiteral } from "src/common/interfaces/object-literal.interface";
import { StockEntity } from "../entities/stock.entity";
import { Document } from "typeorm";
import { UpdateResult } from "mongodb";

export interface IUpdateFilter {
  $set: ObjectLiteral;
}

export interface IStockRepository {
  findOne(query: ObjectLiteral): Promise<StockEntity>;
  updateOne(
    query: ObjectLiteral,
    updateFilter: IUpdateFilter,
  ): Promise<Document | UpdateResult>;
}
