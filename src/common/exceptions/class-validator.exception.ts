import { HttpException, HttpStatus } from "@nestjs/common";
import { ValidationError } from "class-validator";

export class ClassValidatorException extends HttpException {
  constructor(message: string, errors: ValidationError[]) {
    super(
      {
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message,
        errors,
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}
