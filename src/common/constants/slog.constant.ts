import { FactoryProvider, Scope } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { AppLogger } from "src/core/logger";

export const sLog: FactoryProvider = {
  provide: APP_INTERCEPTOR,
  scope: Scope.REQUEST,
  inject: [AppLogger],
  // eslint-disable-next-line
  useFactory: (logger: AppLogger) => {},
};
