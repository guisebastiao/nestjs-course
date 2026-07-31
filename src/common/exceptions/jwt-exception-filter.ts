import { JsonWebTokenError, NotBeforeError, TokenExpiredError } from "@nestjs/jwt";
import { Catch, ExceptionFilter, ArgumentsHost, HttpStatus } from "@nestjs/common";
import { ErrorResponse } from "@/common/dto/error-response";
import { Response } from "express";

@Catch()
export class JwtExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof TokenExpiredError) {
      const data = ErrorResponse.of(
        this.getCode(exception.name),
        "Your token has expired. Please sign or in again.",
      );

      return response.status(HttpStatus.UNAUTHORIZED).json(data);
    }

    if (exception instanceof JsonWebTokenError) {
      const data = ErrorResponse.of(
        this.getCode(exception.name),
        "The token is invalid or malformed.",
      );

      return response.status(HttpStatus.UNAUTHORIZED).json(data);
    }

    if (exception instanceof NotBeforeError) {
      const data = ErrorResponse.of(
        this.getCode(exception.name),
        "The provided token is not active yet.",
      );

      return response.status(HttpStatus.UNAUTHORIZED).json(data);
    }
  }

  private getCode(exceptionName: string): string {
    return exceptionName
      .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
      .toUpperCase()
      .replace("_ERROR", "");
  }
}
