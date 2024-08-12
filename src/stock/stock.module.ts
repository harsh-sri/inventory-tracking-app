import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StockEntity } from "./entities/stock.entity";
import { UpdateStockController } from "./controllers/update-stock.controller";
import { StockService } from "./services/stock.service";
import { ValidationPipe } from "src/common/pipes";
import { NotificationModule } from "src/notification/notification.module";
import { NotificationService } from "src/notification/notification.service";
import { HttpModule } from "src/infra/http/http.module";
import { ProductStockRepository } from "./repository/stock.repository";
import { KafkaModule } from "src/kafka/kafka.module";

@Module({
  imports: [
    KafkaModule,
    TypeOrmModule.forFeature([StockEntity]),
    NotificationModule,
    HttpModule,
  ],
  controllers: [UpdateStockController],
  providers: [
    StockService,
    ValidationPipe,
    NotificationService,
    ProductStockRepository,
  ],
})
export class StockModule {}
