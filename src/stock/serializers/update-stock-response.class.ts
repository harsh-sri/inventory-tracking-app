import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class UpdateStockResponse {
  @ApiProperty({
    type: "number",
    title: "availability",
    description: "product availability in stock",
    example: 10,
    required: true,
  })
  @Expose({
    toPlainOnly: true,
  })
  availability: number;

  //TODO: other fields?
}
