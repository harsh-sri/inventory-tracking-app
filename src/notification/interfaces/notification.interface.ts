export interface INotificationProductAvailabilityPayload {
  availability: number;
}

export interface INotificationPayload {
  url: string;
  method: string;
  data: any;
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
}
