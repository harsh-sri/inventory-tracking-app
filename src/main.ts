import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "./core";
import { Logger } from "@nestjs/common";
import { setupApiDoc } from "./common/docs/doc";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("/api", {
    exclude: ["health"],
  });
  const configService: ConfigService = app.get(ConfigService);
  console.log(configService.get("mongo"));
  const port = configService.get("PORT");
  await setupApiDoc(app);
  await app.listen(port);
  Logger.log(`Application is running on port: ${port}`);
}
bootstrap();
