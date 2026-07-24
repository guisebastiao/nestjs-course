import { ClassValidatorException } from "@/common/exceptions/class-validator.exception";
import { HttpExceptionFilter } from "@/common/exceptions/exception.filter";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const PORT = process.env.PORT ?? 8000;

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => new ClassValidatorException("Validation error", errors),
    }),
  );

  await app.listen(PORT);
  console.info(`Server is running on http://localhost:${PORT}`);
}
bootstrap();
