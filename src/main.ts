import { ClassValidatorException } from "@/common/exceptions/class-validator.exception";
import { JwtExceptionFilter } from "@/common/exceptions/jwt-exception-filter";
import { HttpExceptionFilter } from "@/common/exceptions/exception.filter";
import { Transport } from "@nestjs/microservices";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import cookieParser from "cookie-parser";
import { AppModule } from "@/app.module";
import * as express from "express";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const cfg = app.get(ConfigService);

  const PORT = cfg.get<number>("PORT") ?? 8000;

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new JwtExceptionFilter());

  app.use(express.json({ limit: "20mb" }));
  app.use(express.urlencoded({ extended: true, limit: "20mb" }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => new ClassValidatorException("Validation error", errors),
    }),
  );

  app.use(cookieParser());

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [cfg.getOrThrow("RABBITMQ_URL")],
      queue: cfg.getOrThrow("MAIL_QUEUE_NAME"),
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(PORT);

  console.info(`Server is running on http://localhost:${PORT}`);
}
bootstrap();
