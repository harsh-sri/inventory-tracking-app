import * as Joi from "joi";
import { LogLevel } from "../logger/enums/log-level.enum";
export const schema = Joi.object({
  NODE_ENV: Joi.string().valid("test", "dev", "prod").default("dev"),
  PORT: Joi.number().default(3000),
  BASE_URL: Joi.string().default("http://localhost"),
  // MongoDB
  MONGO_URI: Joi.string()
    .required()
    .default("mongodb://admin:example@mongo:27017/stock?authSource=admin"),
  MONGO_MIN_POOL_SIZE: Joi.number().default(5),
  MONGO_MAX_POOL_SIZE: Joi.number().default(10),

  //Notification Threshold
  NOTIFICATION_STOCK_BLOCKER_THRESHOLD: Joi.number().default(0),
  NOTIFICATION_STOCK_CRITICAL_THRESHOLD: Joi.number().default(100),
  NOTIFICATION_STOCK_MEDIUM_THRESHOLD: Joi.number().default(1000),
  NOTIFICATION_STOCK_LOW_THRESHOLD: Joi.number().default(5000),

  // Notification webhook config
  NOTIFICATION_WEB_HOOK: Joi.string().default(
    "https://40764935-920f-4a4a-a354-e3da2e244e38.mock.pstmn.io/notification",
  ),

  // Kafka
  KAFKA_BROKER: Joi.string().default("my_kafka_container:9092"), // TODO: this should be an array of brokers
  KAFKA_SLEEP_TIME: Joi.number().default(5000),
  KAFKA_TOPIC: Joi.string().default("inventory_tracking_notif"),
  KAFKA_CLIENT_ID: Joi.string().default("inventory-tracking-service"),
  KAFKA_REQUEST_TIMEOUT: Joi.number().default(30000),

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
