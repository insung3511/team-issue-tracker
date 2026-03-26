export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly info?: Record<string, unknown>, // Optional additional information about the error
  ) {
    super(message);
    this.name = 'AppError';

    Object.setPrototypeOf(this, AppError.prototype);
  }
}
