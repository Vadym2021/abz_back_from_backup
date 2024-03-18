export class ApiError extends Error {
  public success: boolean;
  public status: number;
  public fails?: Record<string, string[]>;

  constructor(
    message: string,
    success: boolean,
    status: number,
    fails?: Record<string, string[]>,
  ) {
    super(message);
    this.success = success;
    this.status = status;
    this.fails = fails;
  }
}
