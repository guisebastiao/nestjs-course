export class FieldError {
  field: string;
  error: string;

  constructor(field: string, error: string) {
    this.field = field;
    this.error = error;
  }

  public static of(field: string, error: string): FieldError {
    return new FieldError(field, error);
  }
}
