import { Injectable } from "@nestjs/common";
import { ConfigService } from "src/core";
import { AppLogger } from "src/core/logger";
import { HttpService } from "src/infra/http/http.service";
import {
  INotificationPayload,
  INotificationProductAvailabilityPayload,
  INotificationResponse,
} from "./interfaces/notification.interface";

@Injectable()
export class NotificationService {
  private notification_webhook_url;
  constructor(
    private readonly logger: AppLogger,
    private readonly config: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.logger.setContext(NotificationService.name);
    // notif threshold config

    // notification webhook
    this.notification_webhook_url = this.config.notification_webhook.url;
  }

  async sendNotifSync(
    payload: INotificationPayload,
  ): Promise<INotificationResponse> {
    return this.httpService.request(payload);
  }

  async sendProductAvailabilityNotifSync(
    payload: INotificationProductAvailabilityPayload,
  ): Promise<boolean> {
    try {
      const { availability } = payload;

      const requestPayload: INotificationPayload = {
        url: this.notification_webhook_url,
        method: "POST",
        data: {
          availability,
        },
      };

      const response = await this.sendNotifSync(requestPayload);

      if (response?.status === 200) {
        return true;
      }

      return false;
    } catch (err) {
      // lets not break the end user flow during the checkout
      return false;
    }
  }
}
