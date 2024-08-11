import { Injectable } from "@nestjs/common";
import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import { AppLogger } from "src/core/logger";
import { IHttp } from "./http.interface";

@Injectable()
export class HttpService implements IHttp {
  constructor(private readonly logger: AppLogger) {
    this.logger.setContext(HttpService.name);
  }

  async request(requestPayload: AxiosRequestConfig): Promise<AxiosResponse> {
    try {
      const response: AxiosResponse = await axios.request({
        url: requestPayload?.url,
        method: requestPayload?.method,
        data: requestPayload?.data,
      });

      this.logger.error("HTTP ERROR RESPONSE: ", null, {
        requestPayload,
        response: JSON.stringify(response),
      });

      return response;
    } catch (err) {
      this.logger.error("HTTP Request Exception", err, { requestPayload });
      // retry? failover?

      if (err?.code === "ECONNRESET") {
        return this.request(requestPayload);
      }

      throw err;
    }
  }
}
