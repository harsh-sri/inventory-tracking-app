import { Module } from "@nestjs/common";
import { HttpModule } from "src/infra/http/http.module";
import { HttpService } from "src/infra/http/http.service";
import { NotificationService } from "./notification.service";

@Module({
  imports: [HttpModule],
  providers: [HttpService, NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
