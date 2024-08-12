import { Test, TestingModule } from "@nestjs/testing";
import { NotificationService } from "./notification.service";
import { AppLogger } from "src/core/logger";
import { ConfigService } from "src/core";
import { HttpService } from "src/infra/http/http.service";
import {
  INotificationPayload,
  INotificationProductAvailabilityPayload,
  INotificationResponse,
} from "./interfaces/notification.interface";
import { NotificationSeverity } from "./enums/notification-severity.enum";

describe("NotificationService", () => {
  let service: NotificationService;
  let logger: AppLogger;
  // eslint-disable-next-line
  let config: ConfigService;
  let httpService: HttpService;

  beforeEach(async () => {
    const mockLogger = {
      info: jest.fn(),
      setContext: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    };

    const mockHttpService = {
      request: jest.fn(),
    };

    const mockConfigService = {
      notification_webhook: { url: "http://webhook.url" },
      notification_threshold: {
        blocker: 0,
        critical: 100,
        medium: 1000,
        low: 5000,
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: AppLogger,
          useValue: mockLogger,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    logger = module.get<AppLogger>(AppLogger);
    config = module.get<ConfigService>(ConfigService);
    httpService = module.get<HttpService>(HttpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getNotifSeverity", () => {
    it("should return the low notification severity", async () => {
      let err, result;
      try {
        result = await service.getNotifSeverity(6000);
      } catch (e) {
        err = e;
      } finally {
        expect(err).toBeUndefined();
        expect(result).toBeDefined();
        expect(result).toEqual(NotificationSeverity.LOW);
      }
    });

    it("should return the medium notification severity if availability is <= 1000", async () => {
      let err, result;
      try {
        result = await service.getNotifSeverity(1000);
      } catch (e) {
        err = e;
      } finally {
        expect(err).toBeUndefined();
        expect(result).toBeDefined();
        expect(result).toEqual(NotificationSeverity.MEDIUM);
      }
    });

    it("should return the critical notification severity if availability is <= 100", async () => {
      let err, result;
      try {
        result = await service.getNotifSeverity(100);
      } catch (e) {
        err = e;
      } finally {
        expect(err).toBeUndefined();
        expect(result).toBeDefined();
        expect(result).toEqual(NotificationSeverity.CRITICAL);
      }
    });

    it("should return the blocker notification severity if availability is <= 0", async () => {
      let err, result;
      try {
        result = await service.getNotifSeverity(0);
      } catch (e) {
        err = e;
      } finally {
        expect(err).toBeUndefined();
        expect(result).toBeDefined();
        expect(result).toEqual(NotificationSeverity.BLOCKER);
      }
    });
  });

  describe("sendNotifSync", () => {
    it("should send a notification and return the response", async () => {
      const payload: INotificationPayload = {
        url: "http://webhook.url",
        method: "POST",
        data: { availability: 100 },
      };

      const mockResponse: INotificationResponse = {
        status: 200,
        data: {},
      };

      (httpService.request as jest.Mock).mockResolvedValue(mockResponse);

      const response = await service.sendNotifSync(payload);

      expect(response).toEqual(mockResponse);
      expect(httpService.request).toHaveBeenCalledWith(payload);
    });
  });

  describe("sendProductAvailabilityNotifSync", () => {
    it("should return true if the notification is sent successfully", async () => {
      const payload: INotificationProductAvailabilityPayload = {
        availability: 10,
      };

      const mockResponse: INotificationResponse = {
        status: 200,
        data: {},
      };

      (httpService.request as jest.Mock).mockResolvedValue(mockResponse);

      const result = await service.sendProductAvailabilityNotifSync(payload);

      expect(result).toBe(true);

      const expectedRequestPayload: INotificationPayload = {
        url: "http://webhook.url",
        method: "POST",
        data: {
          availability: 10,
          notificationSeverity: NotificationSeverity.CRITICAL,
        },
      };

      expect(httpService.request).toHaveBeenCalledWith(expectedRequestPayload);
    });

    it("should return true without sending the notification when notification severity is low", async () => {
      const payload: INotificationProductAvailabilityPayload = {
        availability: 10000,
      };
      let err, result;
      try {
        result = await service.sendProductAvailabilityNotifSync(payload);
      } catch (e) {
        err = e;
      } finally {
        expect(err).toBeUndefined();
        expect(result).toBe(true);
        expect(httpService.request).toHaveBeenCalledTimes(0);
      }
    });

    it("should return false if the notification fails", async () => {
      const payload: INotificationProductAvailabilityPayload = {
        availability: 10,
      };

      const mockResponse: INotificationResponse = {
        status: 500,
        data: {},
      };

      (httpService.request as jest.Mock).mockResolvedValue(mockResponse);

      let err, result;

      try {
        result = await service.sendProductAvailabilityNotifSync(payload);
      } catch (e) {
        err = e;
      } finally {
        expect(err).toBeUndefined();
        expect(result).toBe(false);
      }
    });

    it("should return false and not throw an error if an exception occurs", async () => {
      const payload: INotificationProductAvailabilityPayload = {
        availability: 10,
      };

      const error = new Error("Network Error");

      (httpService.request as jest.Mock).mockRejectedValue(error);

      let err, result;

      try {
        result = await service.sendProductAvailabilityNotifSync(payload);
      } catch (e) {
        err = e;
      } finally {
        expect(err).toBeUndefined();
        expect(result).toBe(false);
        expect(logger.error).toHaveBeenCalledTimes(0);
      }
    });
  });
});
