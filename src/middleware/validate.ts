import { Request, Response, NextFunction } from "express";
import { ZodTypeAny, ZodError } from "zod";
import { AppError } from "@/utils/AppError";
import { TypedRequest } from "@/types/express";

type Source = "body" | "params" | "query";

export const validate = <T, S extends Source = "body">(
  schema: ZodTypeAny,
  source: S = "body" as S,
) => {
  return (
    req: TypedRequest<any, any, any>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const validated = schema.parse(req[source]);

      // body — можно перезаписать, query/params — только мутация
      if (source === "body") {
        req.body = validated;
      } else {
        Object.assign(req[source], validated);
      }
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const msg = err.issues
          .map((e) => `${e.path.join(".")}: ${e.message}`)
          .join("; ");
        return next(new AppError(400, msg));
      }
      next(err);
    }
  };
};

export type ValidatedRequest<T, P = any, Q = any> = TypedRequest<T, P, Q>;
