export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational = true, // отличаем "ожидаемые" ошибки от багов
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype); // сохраняем прототип для TS
  }
}
