import { Module } from "@nestjs/common";
import { ProducerService } from "./producer.service";
import { ConfigService } from "src/core";

@Module({
  imports: [],
  providers: [ProducerService, ConfigService],
  exports: [ProducerService],
})
export class KafkaModule {}
