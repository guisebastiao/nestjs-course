export class SuccessResponse<T> {
  status: string;
  data: T | null;

  constructor(status: string, data: T) {
    this.status = status;
    this.data = data;
  }

  public static of<T>(data?: T): SuccessResponse<T | null> {
    return new SuccessResponse("success", data ?? null);
  }
}
