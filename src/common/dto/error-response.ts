export class ErrorResponse<T = null> {
  status: string;
  code: string;
  message: string;
  details: T | null;

  constructor(status: string, code: string, message: string, details: T | null) {
    this.status = status;
    this.code = code;
    this.message = message;
    this.details = details;
  }

  public static of<T>(code: string, message: string, details?: T): ErrorResponse<T> {
    return new ErrorResponse("error", code, message, details ?? null);
  }
}
