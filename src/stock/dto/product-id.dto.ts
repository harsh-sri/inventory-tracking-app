import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsUUID } from "class-validator";

export class ProductIdDto {
  @ApiProperty({
    name: "productId",
    type: "uuid",
    required: true,
    title: "id of a product",
    example: "d99eda1d-93b2-4850-bec3-b9ed1b90cf16",
  })
  @IsDefined()
  @IsUUID()
  productId: string;
}
