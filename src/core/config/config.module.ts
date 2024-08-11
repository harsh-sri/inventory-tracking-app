import { Global, Module } from "@nestjs/common";
import { ConfigModule as NestJSConfigModule } from "@nestjs/config";
import { schema } from "./config.schema";
import { ConfigService } from "./config.service";

@Global()
@Module({})
export class ConfigModule {
  static forRoot() {
    return {
      module: ConfigModule,
      global: true,
      imports: [
        NestJSConfigModule.forRoot({
          envFilePath: [".env"],
          isGlobal: true,
          validationSchema: schema,
          validationOptions: {
            allowUnknown: true,
            abortEarly: true,
          },
        }),
      ],
      providers: [ConfigService],
      exports: [ConfigService],
    };
  }
}
