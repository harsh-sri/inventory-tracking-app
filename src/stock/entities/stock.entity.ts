import { IsDate, IsDefined, IsInt, IsString, IsUUID } from "class-validator";
import { Column, Entity, ObjectId, ObjectIdColumn } from "typeorm";

@Entity("stock")
export class StockEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  @IsDefined()
  @IsUUID()
  productId: string;

  @Column()
  @IsDefined()
  @IsUUID()
  warehouseId: string;

  @Column()
  @IsDefined()
  @IsInt()
  availability: number;

  @Column()
  @IsDate()
  @IsDefined()
  createdAt: Date;

  @Column()
  @IsDate()
  @IsDefined()
  updatedAt: Date;
}
