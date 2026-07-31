import { ClassValidatorException } from "@/common/exceptions/class-validator.exception";
import { ErrorResponse } from "@/common/dto/error-response";
import { Response } from "express";
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  ValidationError,
} from "@nestjs/common";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof ClassValidatorException) {
      const body = exception.getResponse() as {
        errors: ValidationError[];
      };

      const fieldErrors = body.errors.flatMap((error) =>
        Object.values(error.constraints ?? {}).map((message) => ({
          field: error.property,
          error: message,
        })),
      );

      return response
        .status(exception.getStatus())
        .json(ErrorResponse.of("VALIDATION_ERROR", exception.message, fieldErrors));
    }

    const data = ErrorResponse.of(this.getCode(exception.name), exception.message);

    return response.status(exception.getStatus()).json(data);
  }

  private getCode(exceptionName: string): string {
    return exceptionName
      .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
      .toUpperCase()
      .replace("_EXCEPTION", "");
  }
}
