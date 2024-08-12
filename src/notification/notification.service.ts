import { Injectable } from "@nestjs/common";
import { ConfigService } from "src/core";
import { AppLogger } from "src/core/logger";
import { HttpService } from "src/infra/http/http.service";
import {
  INotificationPayload,
  INotificationProductAvailabilityPayload,
  INotificationResponse,
} from "./interfaces/notification.interface";
import { NotificationSeverity } from "./enums/notification-severity.enum";

@Injectable()
export class NotificationService {
  private notification_webhook_url;
  constructor(
    private readonly logger: AppLogger,
    private readonly config: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.logger.setContext(NotificationService.name);
    // notification webhook
    this.notification_webhook_url = this.config.notification_webhook.url;
  }

  async sendNotifSync(
    payload: INotificationPayload,
  ): Promise<INotificationResponse> {
    return this.httpService.request(payload);
  }

  async getNotifSeverity(availability: number): Promise<NotificationSeverity> {
    const { blocker, critical, medium, low } =
      this.config.notification_threshold;
    let notificationSeverity: NotificationSeverity;
    if (availability <= blocker) {
      notificationSeverity = NotificationSeverity.BLOCKER;
    } else if (availability <= critical) {
      notificationSeverity = NotificationSeverity.CRITICAL;
    } else if (availability <= medium) {
      notificationSeverity = NotificationSeverity.MEDIUM;
    } else if (availability >= low) {
      notificationSeverity = NotificationSeverity.LOW;
    }

    return notificationSeverity;
  }

  async sendProductAvailabilityNotifSync(
    payload: INotificationProductAvailabilityPayload,
  ): Promise<boolean> {
    try {
      const { availability } = payload;

      const notificationSeverity = await this.getNotifSeverity(availability);

      // only send notification when severity is > low. We can also use severity to decide what type of notification we want to send

      if (notificationSeverity === NotificationSeverity.LOW) {
        return true;
      }

      const requestPayload: INotificationPayload = {
        url: this.notification_webhook_url,
        method: "POST",
        data: {
          availability,
          notificationSeverity,
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
