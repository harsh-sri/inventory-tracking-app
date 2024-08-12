import { NotificationSeverity } from "../enums/notification-severity.enum";

export interface INotificationProductAvailabilityPayload {
  availability: number;
}

export interface INotificationPayload {
  url: string;
  method: string;
  data: any;
}

export interface INotificationAsyncPayload
  extends INotificationProductAvailabilityPayload {
  notificationSeverity: NotificationSeverity;
}

export interface INotificationResponse {
  status: number; // http status code
  data: any; // response data
}

export interface INotification {
  sendNotifSync(payload: INotificationPayload): Promise<boolean>;
  sendProductAvailabilityNotifSync(
    payload: INotificationProductAvailabilityPayload,
  ): Promise<boolean>;
  sendProductAvailabilityNotifAsync(
    payload: INotificationProductAvailabilityPayload,
  ): Promise<boolean>;
}
