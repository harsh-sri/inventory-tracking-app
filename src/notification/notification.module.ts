import { Module } from "@nestjs/common";
import { HttpModule } from "src/infra/http/http.module";
import { HttpService } from "src/infra/http/http.service";
import { NotificationService } from "./notification.service";
import { KafkaModule } from "src/kafka/kafka.module";
import { ProducerService } from "src/kafka/producer.service";

@Module({
  imports: [KafkaModule, HttpModule],
  providers: [HttpService, NotificationService, ProducerService],
  exports: [NotificationService],
})
export class NotificationModule {}
