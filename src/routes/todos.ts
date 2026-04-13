import { Router } from "express";
import { validate } from "@/middleware/validate";
import {
  createTodoSchema,
  updateTodoSchema,
  getTodoByIdSchema,
  getTodosQuerySchema,
} from "@/schemas/todo";
import { TodoController } from "@/controllers/todo.controller";

export function createTodoRouter(controller: TodoController) {
  const router = Router();

  router.get("/", validate(getTodosQuerySchema, "query"), controller.getAll);

  router.get("/:id", validate(getTodoByIdSchema, "params"), controller.getById);

  router.post("/", validate(createTodoSchema), controller.create);

  router.put(
    "/:id",
    validate(getTodoByIdSchema, "params"),
    validate(updateTodoSchema),
    controller.update,
  );

  router.delete(
    "/:id",
    validate(getTodoByIdSchema, "params"),
    controller.delete,
  );

  return router;
}
