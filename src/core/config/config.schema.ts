import * as Joi from "joi";
import { LogLevel } from "../logger/enums/log-level.enum";
export const schema = Joi.object({
  NODE_ENV: Joi.string().valid("test", "dev", "prod").default("dev"),
  PORT: Joi.number().default(3007),
  BASE_URL: Joi.string().default("http://localhost"),
  // MongoDB
  MONGO_URI: Joi.string()
    .required()
    .default("mongodb://admin:example@mongo:27017/stock?authSource=admin"),
  MONGO_MIN_POOL_SIZE: Joi.number().default(5),
  MONGO_MAX_POOL_SIZE: Joi.number().default(10),

  //Notification Threshold

  // Notification webhook config

  NOTIFICATION_WEB_HOOK: Joi.string().default(
    "https://40764935-920f-4a4a-a354-e3da2e244e38.mock.pstmn.io/notification",
  ),

  // Logger
  LOG_NAME: Joi.string()
    .description("name of the log")
    .default("inventory-tracking-service"),
  LOG_LEVEL: Joi.string()
    .valid(
      LogLevel.Info,
      LogLevel.Debug,
      LogLevel.Error,
      LogLevel.Trace,
      LogLevel.Warn,
    )
    .default(LogLevel.Debug),
});
