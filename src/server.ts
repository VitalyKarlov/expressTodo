import express from "express";
import { createTodoModule } from "@/modules/todo/todo.di";
import { errorHandler } from "@/middleware/errorHandler";
import { AppError } from "@/utils/AppError";

const app = express();

app.use(express.json());

app.use("/todos", createTodoModule().router);

app.use((_, __, next) => next(new AppError(404, "Not found")));
app.use(errorHandler);

// Запуск только если файл вызван напрямую
if (process.env.NODE_ENV !== "test") {
  app.listen(3000, () => console.log("http://localhost:3000"));
}

export { app };
