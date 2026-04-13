import { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/AppError";

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Неоперационные ошибки (баги) — логируем, но не светим детали
  if (!(err instanceof AppError) || !err.isOperational) {
    console.error("💥 Unexpected error:", err);
    return res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }

  // Операционные ошибки — возвращаем клиенту
  res.status(err.statusCode).json({ error: err.message });
};
