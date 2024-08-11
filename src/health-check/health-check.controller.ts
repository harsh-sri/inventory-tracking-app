import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { healthTags } from "src/common/docs/constants";

@ApiTags(...healthTags)
@Controller()
export class HealthCheckController {
  @Get("health")
  @ApiOperation({ summary: "Health Check API" })
  @ApiResponse({
    status: 200,
    description: "Returns timestamp, if the app is up and running",
  })
  healthCheck(): string {
    return new Date().toDateString();
  }
}
