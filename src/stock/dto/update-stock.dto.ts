import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsUUID, IsInt, Min, Max } from "class-validator";

export class UpdateStockDto {
  @ApiProperty({
    name: "warehouseId",
    required: true,
    type: "uuid",
    description: "warehouse id",
    example: "d99eda1d-93b2-4850-bec3-b9ed1b90cf14",
  })
  @IsDefined()
  @IsUUID()
  warehouseId: string;

  @ApiProperty({
    name: "productCount",
    required: true,
    type: "number",
    description: "product count that customer wants to purchase",
  })
  @IsDefined()
  @IsInt()
  @Min(1)
  @Max(10) // TODO: this value can be read from config service
  productCount: number;
}
