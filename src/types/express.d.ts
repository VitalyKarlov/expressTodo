import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user: { id: number; iat: number; exp: number };
    }
  }
}

// Базовый интерфейс для расширения
export interface TypedRequest<
  T = unknown,
  P = unknown,
  Q = unknown,
> extends Request {
  body: T;
  params: P;
  query: Q;
}
