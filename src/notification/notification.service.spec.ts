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

describe("NotificationService", () => {
  let service: NotificationService;
  let logger: AppLogger;
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
        },
      };

      expect(httpService.request).toHaveBeenCalledWith(expectedRequestPayload);
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

      const result = await service.sendProductAvailabilityNotifSync(payload);

      expect(result).toBe(false);
    });

    it("should return false and not throw an error if an exception occurs", async () => {
      const payload: INotificationProductAvailabilityPayload = {
        availability: 10,
      };

      const error = new Error("Network Error");

      (httpService.request as jest.Mock).mockRejectedValue(error);

      const result = await service.sendProductAvailabilityNotifSync(payload);

      expect(result).toBe(false);
      expect(logger.error).toHaveBeenCalledTimes(0);
    });
  });
});
