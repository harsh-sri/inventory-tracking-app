import { Test, TestingModule } from "@nestjs/testing";
import { HttpService } from "./http.service";
import { AppLogger } from "src/core/logger";
import axios from "axios";
import { AxiosResponse, AxiosRequestConfig } from "axios";

jest.mock("axios");

describe("HttpService", () => {
  let service: HttpService;
  let logger: AppLogger;

  beforeEach(async () => {
    const mockLogger = {
      setContext: jest.fn(),
      error: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HttpService,
        {
          provide: AppLogger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<HttpService>(HttpService);
    logger = module.get<AppLogger>(AppLogger);
    jest.spyOn(logger, "setContext").mockImplementationOnce(() => null);
    jest.spyOn(logger, "error").mockImplementationOnce(() => null);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should log the error response and return the response", async () => {
    const requestPayload: AxiosRequestConfig = {
      url: "https://abc.com",
      method: "GET",
    };

    const mockResponse: AxiosResponse = {
      data: {},
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as any,
    };

    (axios.request as jest.Mock).mockResolvedValue(mockResponse);

    const response = await service.request(requestPayload);

    expect(response).toEqual(mockResponse);
    expect(logger.error).toHaveBeenCalledWith(
      "HTTP ERROR RESPONSE: ",
      null,
      expect.objectContaining({
        requestPayload,
        response: JSON.stringify(mockResponse),
      }),
    );
  });

  it("should handle errors and retry on ECONNRESET", async () => {
    const requestPayload: AxiosRequestConfig = {
      url: "https://example.com",
      method: "GET",
    };

    const error = {
      code: "ECONNRESET",
      message: "Connection reset by peer",
    };

    (axios.request as jest.Mock)
      .mockRejectedValueOnce(error)
      .mockResolvedValueOnce({
        data: {},
        status: 200,
        statusText: "OK",
        headers: {},
        config: {},
      });

    const response = await service.request(requestPayload);

    expect(axios.request).toHaveBeenCalledTimes(2);
    expect(response.status).toBe(200);
  });

  it("should throw an error if request fails with a non-ECONNRESET error", async () => {
    const requestPayload: AxiosRequestConfig = {
      url: "https://example.com",
      method: "GET",
    };

    const error = new Error("Network Error");

    (axios.request as jest.Mock).mockRejectedValue(error);

    await expect(service.request(requestPayload)).rejects.toThrow(
      "Network Error",
    );

    expect(logger.error).toHaveBeenCalledWith(
      "HTTP Request Exception",
      error,
      expect.objectContaining({ requestPayload }),
    );
  });
});
