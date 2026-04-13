import { TodoRepository } from "@/repositories/todo.repository";
import { TodoService } from "@/services/todo.service";
import { TodoController } from "@/controllers/todo.controller";
import { createTodoRouter } from "@/routes/todos";

export function createTodoModule() {
  const repo = new TodoRepository();
  const service = new TodoService(repo);
  const controller = new TodoController(service);
  const router = createTodoRouter(controller);

  return { router };
}
