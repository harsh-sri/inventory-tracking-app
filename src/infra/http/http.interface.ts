import { AxiosResponse, AxiosRequestConfig } from "axios";

export interface IHttp {
  request(requestPayload: AxiosRequestConfig): Promise<AxiosResponse>;
}
