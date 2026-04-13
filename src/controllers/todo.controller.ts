import { Request, Response, NextFunction } from "express";
import { TodoService } from "@/services/todo.service";
import { ValidatedRequest } from "@/middleware/validate";
import {
  CreateTodoInput,
  UpdateTodoInput,
  GetTodoByIdParams,
  GetTodosQuery,
} from "@/schemas/todo";

export class TodoController {
  constructor(private service: TodoService) {}

  getAll = (
    req: ValidatedRequest<unknown, unknown, GetTodosQuery>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const todos = this.service.getAll(req.query);
      res.json(todos);
    } catch (err) {
      next(err);
    }
  };

  getById = (
    req: ValidatedRequest<unknown, GetTodoByIdParams>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const todo = this.service.getById(req.params.id);
      res.json(todo);
    } catch (err) {
      next(err);
    }
  };

  create = (
    req: ValidatedRequest<CreateTodoInput>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const newTodo = this.service.create(req.body.title);
      res.status(201).json(newTodo);
    } catch (err) {
      next(err);
    }
  };

  update = (
    req: ValidatedRequest<UpdateTodoInput, GetTodoByIdParams>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const updated = this.service.update(req.params.id, req.body);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  };

  delete = (
    req: ValidatedRequest<unknown, GetTodoByIdParams>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      this.service.delete(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}
